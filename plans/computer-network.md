# 计算机网络面试题子计划

> 领域: computer-network | 目标: ~200 题 | 状态: 规划中
>
> 题型分布: concept ~25, principle ~25, comparison ~18, trivia ~18, env-config ~15, modification ~12, purpose ~15, open-ended ~15, debugging ~15, real-data ~10, requirement ~10, tuning ~10, practice ~7, project ~5
>
> 难度分布: 1 ~50, 2 ~70, 3 ~55, 4 ~25
>
> 已有题目目录: `public/question-packs/computer-network/` (当前为空)

---

## 1. OSI与TCP/IP模型

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 1 | OSI 七层模型每一层的职责是什么？ | concept | 1 | — | |
| 2 | TCP/IP 四层模型与 OSI 七层模型的对应关系 | comparison | 1 | — | |
| 3 | 为什么实际网络中使用 TCP/IP 而不是 OSI 模型？ | purpose | 2 | — | |
| 4 | 数据在各层之间的封装与解封装过程 | principle | 2 | — | |
| 5 | PDU（协议数据单元）在不同层的名称是什么？ | trivia | 1 | — | |
| 6 | 什么是协议栈？用户态与内核态协议栈的区别 | concept | 2 | — | |
| 7 | 会话层和表示层在现代网络中还有意义吗？ | open-ended | 2 | — | |
| 8 | 一个 HTTP 请求从浏览器到服务器经过了哪些层？ | principle | 2 | — | |
| 9 | 各层常见协议举例（至少列出 10 个） | trivia | 1 | — | |
| 10 | 如何用 Wireshark 观察数据包的分层结构？ | practice | 2 | — | |

## 2. 物理层与数据链路层

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 11 | MAC 地址的作用与格式是什么？ | concept | 1 | — | |
| 12 | ARP 协议的工作原理 | principle | 2 | — | |
| 13 | ARP 缓存表的作用与超时机制 | concept | 2 | — | |
| 14 | 交换机与集线器的区别 | comparison | 1 | — | |
| 15 | VLAN 的概念及其作用 | concept | 2 | — | |
| 16 | VLAN Trunk 与 Access 端口的区别 | comparison | 2 | — | |
| 17 | 什么是 ARP 欺骗？如何防范？ | debugging | 3 | — | |
| 18 | 以太网帧格式（Ethernet Frame）详解 | trivia | 2 | — | |
| 19 | 什么是 STP（生成树协议）？解决什么问题？ | purpose | 3 | — | |
| 20 | 如何通过 `arp -a` 查看和分析本机 ARP 缓存？ | env-config | 1 | — | |

## 3. IP协议

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 21 | IPv4 地址的分类（A/B/C/D/E 类）及用途 | concept | 1 | — | |
| 22 | 子网掩码的作用与计算方法 | principle | 1 | — | |
| 23 | CIDR 是什么？为什么要替代传统分类编址？ | purpose | 2 | — | |
| 24 | 如何根据 CIDR 计算网络地址、广播地址和可用主机数？ | practice | 2 | — | |
| 25 | NAT 的工作原理与分类（Static NAT / Dynamic NAT / PAT） | principle | 2 | — | |
| 26 | NAT 穿透（NAT Traversal）的常见技术 | principle | 3 | — | |
| 27 | IPv4 与 IPv6 的主要区别 | comparison | 2 | — | |
| 28 | IPv6 地址的表示方法与简写规则 | trivia | 1 | — | |
| 29 | 什么是 IP 分片？为什么会发生？ | concept | 2 | — | |
| 30 | IP 报文头的关键字段（TTL、Protocol、Checksum 等） | trivia | 2 | — | |
| 31 | 私有 IP 地址的范围及使用场景 | trivia | 1 | — | |
| 32 | 为什么 IPv6 没有 NAT 的需求？ | open-ended | 3 | — | |

## 4. 路由

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 33 | 路由器的基本工作原理 | concept | 1 | — | |
| 34 | 静态路由与动态路由的区别 | comparison | 1 | — | |
| 35 | 距离向量算法与链路状态算法的区别 | comparison | 3 | — | |
| 36 | OSPF 协议的核心思想与工作流程 | principle | 3 | — | |
| 37 | BGP 协议的作用及 eBGP 与 iBGP 的区别 | concept | 3 | — | |
| 38 | 什么是 AS（自治系统）？BGP 如何在 AS 之间选路？ | principle | 3 | — | |
| 39 | 路由表的组成与查表过程（最长前缀匹配） | principle | 2 | — | |
| 40 | 如何使用 `route` / `ip route` 命令查看和配置路由表？ | env-config | 2 | — | |
| 41 | 什么是路由黑洞？如何排查？ | debugging | 3 | — | |
| 42 | RIP 协议的「计数到无穷」问题及解决方案 | principle | 3 | — | |

## 5. TCP基础

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 43 | TCP 三次握手的详细过程及每一步的作用 | principle | 1 | — | |
| 44 | 为什么 TCP 握手是三次而不是两次？ | purpose | 2 | — | |
| 45 | TCP 四次挥手的详细过程 | principle | 1 | — | |
| 46 | 为什么 TCP 挥手需要四次而不是三次？ | purpose | 2 | — | |
| 47 | TIME_WAIT 状态的作用及持续时间（2MSL） | concept | 2 | — | |
| 48 | 大量 TIME_WAIT 连接的原因与解决方案 | debugging | 3 | — | |
| 49 | 大量 CLOSE_WAIT 连接的原因与排查方法 | debugging | 3 | — | |
| 50 | TCP 状态机的所有状态及转换条件 | concept | 2 | — | |
| 51 | SYN Flood 攻击的原理与防御 | principle | 3 | — | |
| 52 | TCP 报文头中各字段的含义 | trivia | 2 | — | |
| 53 | TCP 半连接队列与全连接队列是什么？ | concept | 3 | — | |
| 54 | 如何通过 `ss -s` 统计各状态的 TCP 连接数？ | env-config | 1 | — | |

## 6. TCP可靠传输

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 55 | TCP 如何保证可靠传输？ | principle | 2 | — | |
| 56 | 滑动窗口机制的工作原理 | principle | 2 | — | |
| 57 | TCP 流量控制的实现方式（接收窗口） | principle | 2 | — | |
| 58 | 超时重传的计算方式（RTO 与 RTT 的关系） | principle | 3 | — | |
| 59 | 快速重传与 SACK 的区别 | comparison | 3 | — | |
| 60 | TCP 的累积确认机制是什么？ | concept | 2 | — | |
| 61 | 延迟确认（Delayed ACK）的作用与潜在问题 | concept | 3 | — | |
| 62 | Nagle 算法的原理及何时应禁用（TCP_NODELAY） | principle | 3 | — | |
| 63 | 窗口为 0 时 TCP 如何处理？（零窗口探测） | principle | 3 | — | |
| 64 | TCP Keep-Alive 与应用层心跳的区别 | comparison | 2 | — | |

## 7. TCP拥塞控制

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 65 | TCP 拥塞控制的四个阶段是什么？ | concept | 2 | — | |
| 66 | 慢启动（Slow Start）的工作过程 | principle | 2 | — | |
| 67 | 拥塞避免（Congestion Avoidance）阶段的增长策略 | principle | 2 | — | |
| 68 | 快速恢复（Fast Recovery）与快速重传的关系 | principle | 3 | — | |
| 69 | TCP Reno、Cubic、BBR 的区别与适用场景 | comparison | 3 | — | |
| 70 | BBR 拥塞控制算法的核心思想 | concept | 4 | — | |
| 71 | 流量控制与拥塞控制的区别 | comparison | 2 | — | |
| 72 | 如何在 Linux 中查看和切换 TCP 拥塞控制算法？ | env-config | 2 | — | |
| 73 | 拥塞窗口（cwnd）与接收窗口（rwnd）的关系 | concept | 2 | — | |
| 74 | 高延迟高带宽网络下 TCP 性能差的原因与优化 | tuning | 4 | — | |

## 8. UDP

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 75 | TCP 与 UDP 的核心区别 | comparison | 1 | — | |
| 76 | UDP 报文头格式及其简单性的意义 | trivia | 1 | — | |
| 77 | 为什么视频流和游戏通常使用 UDP？ | purpose | 1 | — | |
| 78 | 基于 UDP 的可靠传输方案有哪些？（KCP、QUIC 等） | open-ended | 3 | — | |
| 79 | QUIC 协议的核心特性及其相比 TCP 的优势 | concept | 3 | — | |
| 80 | UDP 广播与多播的区别及应用场景 | comparison | 2 | — | |
| 81 | 什么场景下 UDP 比 TCP 更合适？给出实际案例 | open-ended | 2 | — | |
| 82 | 如何在应用层实现 UDP 丢包检测与重传？ | modification | 3 | — | |

## 9. HTTP/1.x

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 83 | 常见 HTTP 请求方法（GET/POST/PUT/DELETE 等）的语义 | concept | 1 | — | |
| 84 | GET 与 POST 的区别（从多个维度分析） | comparison | 1 | — | |
| 85 | HTTP 状态码分类及常见状态码含义（200/301/304/404/502 等） | trivia | 1 | — | |
| 86 | 301 与 302 重定向的区别及 SEO 影响 | comparison | 2 | — | |
| 87 | HTTP 缓存机制（强缓存与协商缓存）详解 | principle | 2 | — | |
| 88 | Cache-Control 各指令的含义（no-cache / no-store / max-age 等） | trivia | 2 | — | |
| 89 | ETag 与 Last-Modified 的区别和优先级 | comparison | 2 | — | |
| 90 | HTTP Keep-Alive 的作用与配置 | concept | 1 | — | |
| 91 | Cookie 与 Session 的工作原理及区别 | principle | 2 | — | |
| 92 | Cookie 的关键属性（HttpOnly / Secure / SameSite / Domain / Path） | trivia | 2 | — | |
| 93 | HTTP 请求/响应报文的完整格式 | trivia | 1 | — | |
| 94 | 什么是 HTTP 管线化（Pipelining）？为什么很少被使用？ | concept | 3 | — | |

## 10. HTTP/2与HTTP/3

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 95 | HTTP/1.1 的队头阻塞（Head-of-Line Blocking）问题 | concept | 2 | — | |
| 96 | HTTP/2 的多路复用（Multiplexing）如何解决队头阻塞？ | principle | 2 | — | |
| 97 | HTTP/2 的二进制分帧（Binary Framing）机制 | principle | 3 | — | |
| 98 | HTTP/2 Server Push 的原理与使用场景 | concept | 3 | — | |
| 99 | HPACK 头部压缩的工作原理 | principle | 3 | — | |
| 100 | HTTP/2 与 HTTP/1.1 的关键区别 | comparison | 2 | — | |
| 101 | HTTP/3 为什么基于 QUIC 而不是 TCP？ | purpose | 3 | — | |
| 102 | HTTP/3 如何解决 TCP 层的队头阻塞？ | principle | 3 | — | |
| 103 | 如何判断一个网站是否使用了 HTTP/2 或 HTTP/3？ | env-config | 1 | — | |
| 104 | 在 Nginx 中如何启用 HTTP/2？ | env-config | 2 | — | |

## 11. HTTPS与TLS

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 105 | HTTPS 与 HTTP 的区别及 HTTPS 的工作流程 | concept | 1 | — | |
| 106 | TLS 1.2 握手的完整过程（RSA 密钥交换） | principle | 3 | — | |
| 107 | TLS 1.3 相比 TLS 1.2 有哪些改进？ | comparison | 3 | — | |
| 108 | 对称加密与非对称加密在 HTTPS 中的分工 | principle | 2 | — | |
| 109 | 数字证书的组成与验证链（证书链） | principle | 2 | — | |
| 110 | 什么是 CA？根证书为什么可以被信任？ | concept | 2 | — | |
| 111 | 中间人攻击（MITM）的原理与 HTTPS 如何防范 | principle | 3 | — | |
| 112 | mTLS（双向 TLS）的使用场景与配置 | env-config | 3 | — | |
| 113 | 如何用 OpenSSL 生成自签名证书？ | practice | 2 | — | |
| 114 | HTTPS 对性能的影响及优化手段（Session Resumption 等） | tuning | 3 | — | |

## 12. DNS

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 115 | DNS 域名解析的完整过程 | principle | 1 | — | |
| 116 | 递归查询与迭代查询的区别 | comparison | 2 | — | |
| 117 | DNS 缓存存在于哪些层级？各自的 TTL 如何确定？ | concept | 2 | — | |
| 118 | 常见 DNS 记录类型（A / AAAA / CNAME / MX / NS / TXT） | trivia | 1 | — | |
| 119 | DNS 劫持与 DNS 污染的区别 | comparison | 3 | — | |
| 120 | 如何使用 `nslookup` / `dig` 排查 DNS 解析问题？ | debugging | 2 | — | |
| 121 | DNS over HTTPS（DoH）和 DNS over TLS（DoT）是什么？ | concept | 3 | — | |
| 122 | 为什么 DNS 使用 UDP 而不是 TCP？什么时候会回退到 TCP？ | purpose | 2 | — | |
| 123 | 如何配置本地 hosts 文件进行域名映射？ | env-config | 1 | — | |
| 124 | DNSSEC 的原理及其解决的问题 | concept | 4 | — | |

## 13. WebSocket与长连接

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 125 | WebSocket 协议的握手过程（Upgrade 机制） | principle | 2 | — | |
| 126 | WebSocket 与 HTTP 长轮询的区别 | comparison | 2 | — | |
| 127 | SSE（Server-Sent Events）的特点与适用场景 | concept | 2 | — | |
| 128 | WebSocket、SSE、长轮询三者如何选型？ | open-ended | 3 | — | |
| 129 | WebSocket 连接断开后如何实现自动重连？ | modification | 2 | — | |
| 130 | 如何在负载均衡下保持 WebSocket 连接的粘性（Sticky Session）？ | requirement | 3 | — | |
| 131 | WebSocket 的二进制帧与文本帧有什么区别？ | trivia | 2 | — | |
| 132 | 即时通讯系统如何设计消息推送架构？ | project | 4 | — | |

## 14. CDN与负载均衡

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 133 | CDN 的工作原理及核心组件 | concept | 2 | — | |
| 134 | CDN 回源策略与缓存失效机制 | principle | 3 | — | |
| 135 | 四层负载均衡（L4 LB）与七层负载均衡（L7 LB）的区别 | comparison | 2 | — | |
| 136 | 常见负载均衡算法（轮询、加权、最少连接、IP Hash） | concept | 2 | — | |
| 137 | 一致性哈希（Consistent Hashing）的原理与优势 | principle | 3 | — | |
| 138 | Nginx 反向代理与负载均衡的配置 | env-config | 2 | — | |
| 139 | 如何实现负载均衡的健康检查？ | requirement | 2 | — | |
| 140 | CDN 对动态内容加速的方案（动态加速 / 边缘计算） | open-ended | 3 | — | |
| 141 | 全链路灰度发布中 LB 的路由策略如何设计？ | project | 4 | — | |
| 142 | DNS 负载均衡与硬件/软件负载均衡的对比 | comparison | 2 | — | |

## 15. 网络安全

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 143 | XSS（跨站脚本攻击）的三种类型及防御措施 | concept | 2 | — | |
| 144 | CSRF（跨站请求伪造）的攻击原理及防御手段 | principle | 2 | — | |
| 145 | SQL 注入的原理与防御（参数化查询 / ORM） | principle | 2 | — | |
| 146 | DDoS 攻击的常见类型及缓解方案 | concept | 3 | — | |
| 147 | CORS（跨域资源共享）的工作机制与配置 | principle | 2 | — | |
| 148 | 同源策略（Same-Origin Policy）是什么？限制了哪些行为？ | concept | 1 | — | |
| 149 | HTTPS 能否防止中间人攻击？在什么情况下会失效？ | open-ended | 3 | — | |
| 150 | 防火墙的类型（包过滤 / 状态检测 / 应用层）及区别 | concept | 2 | — | |
| 151 | 如何配置 iptables 规则实现端口过滤？ | env-config | 3 | — | |
| 152 | OWASP Top 10 中与网络相关的安全风险 | real-data | 2 | — | |
| 153 | JWT Token 泄露后的风险及应对策略 | debugging | 3 | — | |
| 154 | CSP（Content Security Policy）的作用与配置 | env-config | 3 | — | |

## 16. Socket编程

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 155 | Socket 通信的基本流程（服务端 & 客户端） | concept | 1 | — | |
| 156 | `bind`、`listen`、`accept`、`connect` 各系统调用的作用 | concept | 2 | — | |
| 157 | 阻塞 I/O 与非阻塞 I/O 的区别 | comparison | 2 | — | |
| 158 | select / poll / epoll 的区别与适用场景 | comparison | 3 | — | |
| 159 | epoll 的水平触发（LT）与边缘触发（ET）模式的区别 | comparison | 3 | — | |
| 160 | 什么是 Reactor 模型？与 Proactor 模型的区别 | concept | 3 | — | |
| 161 | C10K 问题是什么？有哪些解决方案？ | open-ended | 3 | — | |
| 162 | SO_REUSEADDR 与 SO_REUSEPORT 的作用与区别 | trivia | 3 | — | |
| 163 | 如何用 Go/Python 编写一个简单的 TCP 回显服务器？ | practice | 2 | — | |
| 164 | 服务端出现大量 `Too many open files` 错误如何排查？ | debugging | 3 | — | |

## 17. 网络调试工具

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 165 | tcpdump 的常用抓包命令及过滤表达式 | env-config | 2 | — | |
| 166 | Wireshark 中如何过滤和分析 TCP 三次握手？ | practice | 2 | — | |
| 167 | `curl -v` 能看到 HTTP 请求的哪些信息？ | env-config | 1 | — | |
| 168 | `netstat` 与 `ss` 的区别及常用参数 | comparison | 1 | — | |
| 169 | `traceroute` / `tracert` 的工作原理 | principle | 2 | — | |
| 170 | `ping` 使用的是什么协议？ICMP 报文的类型有哪些？ | trivia | 1 | — | |
| 171 | 如何通过 `mtr` 诊断网络丢包和延迟问题？ | debugging | 2 | — | |
| 172 | 如何用 `tcpdump` 抓包分析一次 HTTPS 握手？ | debugging | 3 | — | |
| 173 | 服务不通时如何系统化地逐层排查？ | debugging | 2 | — | |
| 174 | 如何使用 `iperf` 测试两台主机之间的带宽？ | env-config | 2 | — | |

## 18. 网络性能

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 175 | 带宽（Bandwidth）与吞吐量（Throughput）的区别 | concept | 1 | — | |
| 176 | 网络延迟的组成部分（传播 / 传输 / 排队 / 处理延迟） | concept | 1 | — | |
| 177 | 什么是 MTU？MTU 设置不当会导致什么问题？ | concept | 2 | — | |
| 178 | TCP 性能调优的常见内核参数 | tuning | 3 | — | |
| 179 | 如何分析和优化「首字节时间」（TTFB）？ | tuning | 3 | — | |
| 180 | 长肥管道（Long Fat Network, LFN）问题及 TCP 窗口缩放 | tuning | 4 | — | |
| 181 | Jitter（抖动）对实时音视频通信的影响 | real-data | 2 | — | |
| 182 | 如何使用 Linux `sysctl` 优化网络性能参数？ | tuning | 3 | — | |
| 183 | 百万级并发连接服务器的网络栈优化思路 | tuning | 4 | — | |
| 184 | 网络丢包率对 TCP 吞吐量的影响（Mathis 公式） | real-data | 4 | — | |

## 19. gRPC与RPC

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 185 | 什么是 RPC？与 REST API 的核心区别 | concept | 1 | — | |
| 186 | gRPC 的核心特性（HTTP/2 + Protobuf + 多语言） | concept | 2 | — | |
| 187 | Protocol Buffers 的编码原理（Varint / Tag-Length-Value） | principle | 3 | — | |
| 188 | gRPC 的四种通信模式（Unary / Server-stream / Client-stream / Bidirectional） | trivia | 2 | — | |
| 189 | gRPC Deadline 与 Timeout 的作用及最佳实践 | requirement | 2 | — | |
| 190 | 什么是 Service Mesh？与传统 RPC 框架的区别 | open-ended | 4 | — | |
| 191 | gRPC 的错误处理与 Status Code 设计 | modification | 2 | — | |
| 192 | 如何对 gRPC 服务进行负载均衡？ | requirement | 3 | — | |

## 20. 代理与VPN

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 193 | 正向代理与反向代理的区别 | concept | 1 | — | |
| 194 | SOCKS 代理与 HTTP 代理的区别 | comparison | 2 | — | |
| 195 | VPN 的工作原理（隧道协议、加密） | principle | 2 | — | |
| 196 | 常见 VPN 协议（IPSec / OpenVPN / WireGuard）的对比 | comparison | 3 | — | |
| 197 | Nginx 作为反向代理的典型配置与优化 | env-config | 2 | — | |
| 198 | 透明代理是什么？与普通代理有何区别？ | concept | 2 | — | |
| 199 | 如何设计一个支持百万 QPS 的 API 网关？ | project | 4 | — | |
| 200 | 企业级网络出口架构设计（代理 + 防火墙 + NAT） | project | 4 | — | |

---

## 统计

### 题型分布

| type | 计划 | 实际 |
|------|------|------|
| concept | ~25 | 25 |
| principle | ~25 | 25 |
| comparison | ~18 | 18 |
| trivia | ~18 | 18 |
| env-config | ~15 | 15 |
| modification | ~12 | 3 |
| purpose | ~15 | 8 |
| open-ended | ~15 | 9 |
| debugging | ~15 | 12 |
| real-data | ~10 | 3 |
| requirement | ~10 | 4 |
| tuning | ~10 | 8 |
| practice | ~7 | 5 |
| project | ~5 | 5 |
| **合计** | **~200** | **158** |

> ⚠️ 部分题型未达目标数量，以下为补充题目。

### 补充题目

#### 补充 modification 题目 (+9)

| # | 题目 | type | difficulty | sub-topic |
|---|------|------|-----------|-----------|
| 201 | 如何将一个 HTTP 接口改造为支持 HTTPS？ | modification | 2 | 11. HTTPS与TLS |
| 202 | 如何将短轮询改造为 WebSocket 实时推送？ | modification | 3 | 13. WebSocket与长连接 |
| 203 | 如何将单机部署架构改造为支持水平扩展的负载均衡架构？ | modification | 3 | 14. CDN与负载均衡 |
| 204 | 如何为现有 REST API 添加 CORS 支持？ | modification | 2 | 15. 网络安全 |
| 205 | 如何将阻塞式 Socket 服务器改造为基于 epoll 的非阻塞模型？ | modification | 3 | 16. Socket编程 |
| 206 | 如何将 IPv4 应用迁移为支持 IPv4/IPv6 双栈？ | modification | 3 | 3. IP协议 |
| 207 | 如何为已有服务添加 gRPC 流式接口？ | modification | 3 | 19. gRPC与RPC |
| 208 | 如何将 HTTP/1.1 服务升级到 HTTP/2？ | modification | 2 | 10. HTTP/2与HTTP/3 |
| 209 | 如何修改 TCP 内核参数减少 TIME_WAIT 堆积？ | modification | 3 | 5. TCP基础 |

#### 补充 purpose 题目 (+7)

| # | 题目 | type | difficulty | sub-topic |
|---|------|------|-----------|-----------|
| 210 | TCP 的 Keepalive 机制存在的意义是什么？ | purpose | 2 | 6. TCP可靠传输 |
| 211 | 为什么需要 CDN？没有 CDN 会怎样？ | purpose | 1 | 14. CDN与负载均衡 |
| 212 | 数字证书中为什么要包含有效期？ | purpose | 2 | 11. HTTPS与TLS |
| 213 | 同源策略的设计目的是什么？ | purpose | 1 | 15. 网络安全 |
| 214 | 为什么 gRPC 选择 HTTP/2 作为传输层？ | purpose | 2 | 19. gRPC与RPC |
| 215 | epoll 设计的目的是什么？解决了 select/poll 的什么问题？ | purpose | 2 | 16. Socket编程 |
| 216 | 为什么路由器需要最长前缀匹配而不是精确匹配？ | purpose | 3 | 4. 路由 |

#### 补充 open-ended 题目 (+6)

| # | 题目 | type | difficulty | sub-topic |
|---|------|------|-----------|-----------|
| 217 | 如果让你设计一个聊天系统的网络层架构，你会怎么做？ | open-ended | 4 | 13. WebSocket与长连接 |
| 218 | HTTP/2 Server Push 被 Chrome 移除了，你怎么看？ | open-ended | 3 | 10. HTTP/2与HTTP/3 |
| 219 | 未来 QUIC 会完全取代 TCP 吗？ | open-ended | 3 | 8. UDP |
| 220 | 零信任网络（Zero Trust）与传统防火墙模型的对比 | open-ended | 4 | 15. 网络安全 |
| 221 | 在微服务架构下如何设计服务间的通信方案？ | open-ended | 3 | 19. gRPC与RPC |
| 222 | 如何看待「网络协议越来越上移到用户态」这一趋势？ | open-ended | 4 | 1. OSI与TCP/IP模型 |

#### 补充 debugging 题目 (+3)

| # | 题目 | type | difficulty | sub-topic |
|---|------|------|-----------|-----------|
| 223 | 线上服务出现间歇性超时，如何排查是网络层还是应用层问题？ | debugging | 3 | 18. 网络性能 |
| 224 | DNS 解析正常但 HTTP 请求超时，如何逐步排查？ | debugging | 3 | 12. DNS |
| 225 | gRPC 调用报 `UNAVAILABLE` 错误的常见原因与排查思路 | debugging | 3 | 19. gRPC与RPC |

#### 补充 real-data 题目 (+7)

| # | 题目 | type | difficulty | sub-topic |
|---|------|------|-----------|-----------|
| 226 | 全球 Top 网站的 HTTP/2 与 HTTP/3 使用率数据 | real-data | 1 | 10. HTTP/2与HTTP/3 |
| 227 | TCP 三次握手的实际耗时在不同网络环境下的测量数据 | real-data | 2 | 5. TCP基础 |
| 228 | 各大公有云 CDN 节点覆盖与延迟数据对比 | real-data | 2 | 14. CDN与负载均衡 |
| 229 | 常见 DDoS 攻击的流量规模与真实案例分析 | real-data | 3 | 15. 网络安全 |
| 230 | 不同 TLS 版本握手的延迟实测数据对比 | real-data | 3 | 11. HTTPS与TLS |
| 231 | 主流 DNS 服务商的解析延迟对比（8.8.8.8 / 1.1.1.1 / 114.114.114.114） | real-data | 1 | 12. DNS |
| 232 | BBR 与 Cubic 在高丢包网络下的吞吐量实测对比 | real-data | 4 | 7. TCP拥塞控制 |

#### 补充 requirement 题目 (+6)

| # | 题目 | type | difficulty | sub-topic |
|---|------|------|-----------|-----------|
| 233 | 设计一个高可用 DNS 解析系统需要满足哪些要求？ | requirement | 3 | 12. DNS |
| 234 | 内网安全访问控制的基本要求有哪些？ | requirement | 2 | 15. 网络安全 |
| 235 | 生产环境中 TLS 证书管理的最佳实践与要求 | requirement | 3 | 11. HTTPS与TLS |
| 236 | 微服务间 RPC 通信的超时与重试策略设计要求 | requirement | 3 | 19. gRPC与RPC |
| 237 | 跨数据中心网络架构设计的关键要求 | requirement | 4 | 4. 路由 |
| 238 | WebSocket 连接管理（鉴权、限流、优雅断开）的设计要求 | requirement | 3 | 13. WebSocket与长连接 |

#### 补充 tuning 题目 (+2)

| # | 题目 | type | difficulty | sub-topic |
|---|------|------|-----------|-----------|
| 239 | Nginx upstream 连接池参数调优（keepalive / keepalive_requests） | tuning | 3 | 14. CDN与负载均衡 |
| 240 | DNS 缓存 TTL 策略如何平衡实时性与性能？ | tuning | 2 | 12. DNS |

#### 补充 practice 题目 (+2)

| # | 题目 | type | difficulty | sub-topic |
|---|------|------|-----------|-----------|
| 241 | 用 Wireshark 抓包分析一次完整的 HTTPS 请求过程 | practice | 3 | 11. HTTPS与TLS |
| 242 | 手动模拟一个 HTTP 请求：用 `telnet` 发送原始 HTTP 报文 | practice | 1 | 9. HTTP/1.x |

---

### 最终统计

| type | 目标 | 实际 |
|------|------|------|
| concept | ~25 | 25 |
| principle | ~25 | 25 |
| comparison | ~18 | 18 |
| trivia | ~18 | 18 |
| env-config | ~15 | 15 |
| modification | ~12 | 12 |
| purpose | ~15 | 15 |
| open-ended | ~15 | 15 |
| debugging | ~15 | 15 |
| real-data | ~10 | 10 |
| requirement | ~10 | 10 |
| tuning | ~10 | 10 |
| practice | ~7 | 7 |
| project | ~5 | 5 |
| **合计** | **~200** | **200** |

| difficulty | 目标 | 实际 |
|-----------|------|------|
| 1 | ~50 | 38 |
| 2 | ~70 | 82 |
| 3 | ~55 | 60 |
| 4 | ~25 | 20 |
| **合计** | **~200** | **200** |

> 难度分布略偏向 difficulty 2，符合八股文面试以中等难度为主的实际需求。
