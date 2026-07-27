# OMP Bridge

把内网 Linux 上的 [Oh My Pi](https://github.com/can1357/oh-my-pi)（`omp`）完整能力，经一台只有公网 IP、带宽有限（如 3Mbps）的云主机，安全暴露给浏览器使用。

```
[浏览器 Web 控制台] ──WSS──▶ [云主机 Relay] ◀──WSS── [内网 Agent]
                                                   ├─ omp --mode rpc   （消息 / 设置全量透传）
                                                   ├─ PTY 终端
                                                   └─ 文件上传下载
```

内网机器**主动连出**到云主机，不需要公网 IP / 端口映射。Relay 只做鉴权与帧转发，不解析 omp 内容，适合小带宽。

## 功能

| 能力 | 说明 |
| --- | --- |
| Oh My Pi 消息 | `prompt` / `steer` / `abort` / 流式事件原样转发 |
| 设置 | 模型、thinking、auto compaction / retry、读取 session state |
| 终端 | 交互式 shell（`script` PTY） |
| 文件 | 列表 / 分块上传下载（默认 64KiB/块） |
| 鉴权 | 共享 `OMP_BRIDGE_TOKEN`，agent / client 同房间配对 |

## 快速开始

### 1. 安装

```bash
cd omp-bridge
npm install
npm run build
```

### 2. 云主机启动 Relay

```bash
export OMP_BRIDGE_TOKEN='换成足够长的随机串'
export OMP_BRIDGE_PORT=8787
npm run start:relay
# 等价: node dist/relay/index.js
```

放行端口（或前面挂 Nginx/Caddy 做 TLS 反代到 `8787`）。浏览器打开：

`http://你的云主机:8787/`

### 3. 内网主机启动 Agent

需要本机已安装 `omp`，且能访问云主机。

```bash
export OMP_BRIDGE_TOKEN='与云主机相同'
export OMP_BRIDGE_URL='wss://你的云主机/ws'   # 或 ws://IP:8787/ws
export OMP_BRIDGE_ROOT="$HOME/projects"       # 文件沙箱根目录
export OMP_BRIDGE_CWD="$HOME/projects/app"    # omp / shell 工作目录
npm run start:agent
```

### 4. 浏览器连接

打开 Relay 提供的 Web UI →「连接设置」填入 URL / Token / Room → 连接。  
Agent 显示 online 后即可在「Oh My Pi / 终端 / 文件」使用。

## 开发

```bash
# 终端 1
OMP_BRIDGE_TOKEN=dev npm run dev:relay

# 终端 2
OMP_BRIDGE_TOKEN=dev OMP_BRIDGE_URL=ws://127.0.0.1:8787/ws npm run dev:agent

# 终端 3
npm run dev:web   # http://127.0.0.1:5178 （已代理 /ws）
```

```bash
npm test
npm run typecheck
```

## 协议概要

单 WebSocket，JSON 信封：

```json
{ "v": 1, "ch": "ctl|rpc|term|fs", "type": "...", "id": "...", "payload": {} }
```

- `ctl`：hello / peer_status / ping
- `rpc`：`{ frame }` 透传 omp NDJSON
- `term`：open / data(base64) / resize / close
- `fs`：list / read / write / upload / download …

## 带宽建议（~3Mbps）

- Relay 不做二次编码，帧原样转发
- 文件默认 64KiB 分块，避免大包占满链路
- 终端/聊天比传大仓库更合适；大文件尽量走本地或另开通道

## 安全

- **必须**使用强随机 Token，并优先上 TLS（`wss://`）
- Agent 文件访问限制在 `OMP_BRIDGE_ROOT` 内
- 不要把 Token 写进公开仓库；生产用环境变量或 systemd `EnvironmentFile`

## systemd 示例（云主机）

```ini
[Unit]
Description=OMP Bridge Relay
After=network.target

[Service]
Environment=OMP_BRIDGE_TOKEN=change-me
Environment=OMP_BRIDGE_PORT=8787
WorkingDirectory=/opt/omp-bridge
ExecStart=/usr/bin/node dist/relay/index.js
Restart=always

[Install]
WantedBy=multi-user.target
```
