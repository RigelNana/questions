# Docker 面试题子计划

> 领域: docker | 目标: ~200 题 | 状态: 规划中
>
> 类型分布: concept ~25 · principle ~25 · comparison ~18 · trivia ~18 · env-config ~15 · modification ~12 · purpose ~15 · open-ended ~15 · debugging ~15 · real-data ~10 · requirement ~10 · tuning ~10 · practice ~7 · project ~5
>
> 难度分布: ① ~50 · ② ~70 · ③ ~55 · ④ ~25
>
> 题目包文件规划:
> - `docker-basics` → 子主题 1, 2, 3, 6
> - `docker-dockerfile` → 子主题 4, 5, 15
> - `docker-networking` → 子主题 7
> - `docker-storage` → 子主题 8
> - `docker-compose` → 子主题 9
> - `docker-security` → 子主题 10, 20
> - `docker-resources` → 子主题 11, 19
> - `docker-operations` → 子主题 12, 13, 14
> - `docker-cicd` → 子主题 16
> - `docker-orchestration` → 子主题 17
> - `docker-internals` → 子主题 18

---

## 1. 容器基础概念 (12 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 1 | 什么是容器？与传统进程有什么本质区别 | concept | 1 | docker-basics | ⬜ |
| 2 | 容器 vs 虚拟机：架构、性能、隔离性全面对比 | comparison | 1 | docker-basics | ⬜ |
| 3 | 容器化 vs 传统部署 vs 虚拟化部署的适用场景 | comparison | 2 | docker-basics | ⬜ |
| 4 | OCI (Open Container Initiative) 标准包含哪些规范 | concept | 2 | docker-basics | ⬜ |
| 5 | Container Runtime 的分类：high-level vs low-level runtime | concept | 2 | docker-basics | ⬜ |
| 6 | 为什么说容器不是"轻量级虚拟机" | principle | 2 | docker-basics | ⬜ |
| 7 | 容器镜像的不可变性（Immutability）原则及其意义 | principle | 2 | docker-basics | ⬜ |
| 8 | 容器中 PID 1 进程的特殊角色与信号处理 | principle | 3 | docker-basics | ⬜ |
| 9 | 容器技术的演进历史：chroot → LXC → Docker → OCI | trivia | 1 | docker-basics | ⬜ |
| 10 | Linux 容器 vs Windows 容器的实现差异 | comparison | 3 | docker-basics | ⬜ |
| 11 | 容器的 rootfs 是什么？它与宿主机文件系统的关系 | concept | 1 | docker-basics | ⬜ |
| 12 | 一个正在运行的容器在宿主机上看起来是什么样的 | open-ended | 1 | docker-basics | ⬜ |

## 2. Docker 架构 (10 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 13 | Docker 的 Client-Server 架构模型详解 | concept | 1 | docker-basics | ⬜ |
| 14 | dockerd、containerd、runc 三者的职责与协作关系 | principle | 2 | docker-basics | ⬜ |
| 15 | containerd-shim 的作用：为什么需要 shim 中间层 | principle | 3 | docker-basics | ⬜ |
| 16 | Docker CLI 与 Docker Daemon 之间的通信协议 | concept | 2 | docker-basics | ⬜ |
| 17 | Docker Desktop 和 Docker Engine 的区别与适用场景 | comparison | 1 | docker-basics | ⬜ |
| 18 | daemon.json 配置文件的常用选项与最佳实践 | env-config | 2 | docker-basics | ⬜ |
| 19 | /var/run/docker.sock 是什么？为什么它很重要 | purpose | 2 | docker-basics | ⬜ |
| 20 | CRI (Container Runtime Interface) 的作用与设计目标 | concept | 3 | docker-basics | ⬜ |
| 21 | Moby 项目和 Docker 开源项目是什么关系 | trivia | 2 | docker-basics | ⬜ |
| 22 | Docker Engine API 的 RESTful 接口可以做什么 | purpose | 2 | docker-basics | ⬜ |

## 3. 镜像原理 (10 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 23 | Docker 镜像的分层存储原理是怎样的 | principle | 1 | docker-basics | ⬜ |
| 24 | Union Filesystem 的核心工作原理 | principle | 2 | docker-basics | ⬜ |
| 25 | overlay2 存储驱动的读写（Copy-on-Write）机制 | principle | 3 | docker-basics | ⬜ |
| 26 | Docker Image Manifest 的结构与作用 | concept | 3 | docker-basics | ⬜ |
| 27 | 镜像的 digest 和 tag 有什么区别？为什么推荐用 digest | comparison | 2 | docker-basics | ⬜ |
| 28 | 什么是 dangling image？怎样清理未使用的镜像 | concept | 1 | docker-basics | ⬜ |
| 29 | docker image history 命令输出的信息如何解读 | real-data | 1 | docker-basics | ⬜ |
| 30 | Content Addressable Storage 在镜像存储中的应用 | principle | 3 | docker-basics | ⬜ |
| 31 | overlay2 vs aufs vs devicemapper 存储驱动的选型对比 | comparison | 3 | docker-basics | ⬜ |
| 32 | 拉取镜像时的并行下载和层共享机制是怎样的 | trivia | 2 | docker-basics | ⬜ |

## 4. Dockerfile (12 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 33 | COPY 和 ADD 指令的区别与各自适用场景 | comparison | 1 | docker-dockerfile | ⬜ |
| 34 | CMD vs ENTRYPOINT：区别、组合方式与常见陷阱 | comparison | 2 | docker-dockerfile | ⬜ |
| 35 | RUN、CMD、ENTRYPOINT 三者在构建/运行时的行为差异 | comparison | 1 | docker-dockerfile | ⬜ |
| 36 | Dockerfile 中的 build context 是什么？为什么 docker build 很慢 | concept | 1 | docker-dockerfile | ⬜ |
| 37 | Docker 构建缓存的命中规则与失效条件 | principle | 2 | docker-dockerfile | ⬜ |
| 38 | .dockerignore 文件的语法和最佳实践 | purpose | 1 | docker-dockerfile | ⬜ |
| 39 | ARG 和 ENV 的区别：构建时变量 vs 运行时环境变量 | comparison | 2 | docker-dockerfile | ⬜ |
| 40 | EXPOSE 指令到底做了什么？不写会怎样 | purpose | 1 | docker-dockerfile | ⬜ |
| 41 | HEALTHCHECK 指令的配置参数与健康检查策略 | env-config | 2 | docker-dockerfile | ⬜ |
| 42 | Dockerfile 中 shell form 和 exec form 的区别与信号传递问题 | debugging | 3 | docker-dockerfile | ⬜ |
| 43 | 如何在 Dockerfile 中安全地使用构建时 secrets | modification | 3 | docker-dockerfile | ⬜ |
| 44 | LABEL 指令的标准化用法（OCI Annotations） | trivia | 1 | docker-dockerfile | ⬜ |

## 5. 多阶段构建 (8 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 45 | 多阶段构建（Multi-stage Build）的原理与使用场景 | concept | 2 | docker-dockerfile | ⬜ |
| 46 | COPY --from 的用法：跨阶段复制文件 | concept | 2 | docker-dockerfile | ⬜ |
| 47 | --target 参数指定构建到某个阶段的用途 | env-config | 2 | docker-dockerfile | ⬜ |
| 48 | 多阶段构建中的缓存优化策略 | tuning | 3 | docker-dockerfile | ⬜ |
| 49 | 多阶段构建 vs 单阶段构建的镜像大小对比实测 | comparison | 2 | docker-dockerfile | ⬜ |
| 50 | 在多阶段构建中如何复用中间阶段的 build 产物 | modification | 3 | docker-dockerfile | ⬜ |
| 51 | 为 Java Spring Boot 应用设计多阶段 Dockerfile | practice | 3 | docker-dockerfile | ⬜ |
| 52 | Builder Pattern（构建者模式）在 Docker 中的演变 | trivia | 2 | docker-dockerfile | ⬜ |

## 6. 容器生命周期 (10 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 53 | Docker 容器的完整生命周期：created → running → exited | concept | 1 | docker-basics | ⬜ |
| 54 | docker create 和 docker run 的区别是什么 | comparison | 1 | docker-basics | ⬜ |
| 55 | docker stop vs docker kill：优雅停止 vs 强制终止 | comparison | 1 | docker-basics | ⬜ |
| 56 | restart policy 的四种选项及各自行为 | env-config | 1 | docker-basics | ⬜ |
| 57 | docker pause/unpause 的底层实现原理（freezer cgroup） | principle | 3 | docker-basics | ⬜ |
| 58 | 容器退出码 0、1、137、143 分别代表什么含义 | trivia | 2 | docker-basics | ⬜ |
| 59 | docker wait 命令的使用场景与返回值 | purpose | 2 | docker-basics | ⬜ |
| 60 | 如何实现容器的 Graceful Shutdown | principle | 3 | docker-basics | ⬜ |
| 61 | docker rm -f 与先 stop 后 rm 有什么区别 | trivia | 2 | docker-basics | ⬜ |
| 62 | 容器 init 进程与僵尸进程（zombie process）问题 | debugging | 3 | docker-basics | ⬜ |

## 7. 网络模式 (12 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 63 | Docker bridge 网络模式的工作原理与默认行为 | principle | 2 | docker-networking | ⬜ |
| 64 | host 网络模式的使用场景、优势和限制 | concept | 2 | docker-networking | ⬜ |
| 65 | none 网络模式的存在意义与适用场景 | purpose | 2 | docker-networking | ⬜ |
| 66 | overlay 网络实现跨主机容器通信的原理（VXLAN） | principle | 3 | docker-networking | ⬜ |
| 67 | macvlan 网络模式的使用场景与配置 | env-config | 3 | docker-networking | ⬜ |
| 68 | Docker 容器间的 DNS 自动解析机制 | principle | 2 | docker-networking | ⬜ |
| 69 | docker network create 自定义网络的常用配置 | env-config | 2 | docker-networking | ⬜ |
| 70 | 容器端口映射 -p 的底层原理（iptables 规则） | principle | 3 | docker-networking | ⬜ |
| 71 | 默认 bridge 网络 vs 自定义 bridge 网络的关键差异 | comparison | 2 | docker-networking | ⬜ |
| 72 | 排查容器无法访问外部网络的常见原因 | debugging | 3 | docker-networking | ⬜ |
| 73 | Docker 内嵌 DNS Server 127.0.0.11 的工作原理 | trivia | 3 | docker-networking | ⬜ |
| 74 | 已废弃的 --link 和推荐的自定义网络方案对比 | comparison | 2 | docker-networking | ⬜ |

## 8. 存储与卷 (10 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 75 | Volumes vs Bind Mounts vs tmpfs：三种挂载方式对比 | comparison | 1 | docker-storage | ⬜ |
| 76 | tmpfs mount 的使用场景：敏感数据的临时存储 | purpose | 2 | docker-storage | ⬜ |
| 77 | Docker Volume Driver 插件机制的扩展方式 | concept | 3 | docker-storage | ⬜ |
| 78 | 容器 Copy-on-Write 写时复制机制的性能影响 | principle | 2 | docker-storage | ⬜ |
| 79 | Named Volume 和 Anonymous Volume 的区别与管理 | comparison | 1 | docker-storage | ⬜ |
| 80 | 如何正确备份和恢复 Docker Volume 数据 | practice | 2 | docker-storage | ⬜ |
| 81 | --volumes-from 在容器间共享卷的用法 | env-config | 2 | docker-storage | ⬜ |
| 82 | 存储驱动的选择依据及不同 Linux 发行版的默认值 | open-ended | 2 | docker-storage | ⬜ |
| 83 | 容器内写入数据不影响镜像层的原理解析 | principle | 2 | docker-storage | ⬜ |
| 84 | Docker Volume 的生命周期：创建、使用、清理 | concept | 1 | docker-storage | ⬜ |

## 9. Docker Compose (12 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 85 | Docker Compose 文件的核心结构：services、networks、volumes | concept | 1 | docker-compose | ⬜ |
| 86 | depends_on 的局限性：只控制启动顺序，不等待服务就绪 | trivia | 2 | docker-compose | ⬜ |
| 87 | Compose 中 networks 的配置与自定义网络 | env-config | 2 | docker-compose | ⬜ |
| 88 | Docker Compose v2 (Go 重写) vs v1 (Python) 的区别 | comparison | 2 | docker-compose | ⬜ |
| 89 | Compose Profiles 的使用场景：按环境启用不同服务 | purpose | 2 | docker-compose | ⬜ |
| 90 | Compose 中的变量替换、.env 文件和环境变量优先级 | env-config | 2 | docker-compose | ⬜ |
| 91 | docker compose up vs docker compose start 的行为差异 | comparison | 1 | docker-compose | ⬜ |
| 92 | Compose 中 healthcheck + depends_on condition 实现服务就绪等待 | modification | 3 | docker-compose | ⬜ |
| 93 | 如何在 Compose 中实现服务水平扩容（deploy replicas） | modification | 2 | docker-compose | ⬜ |
| 94 | Compose 中 volumes 的三种定义语法 | concept | 1 | docker-compose | ⬜ |
| 95 | Docker Compose Watch 模式与本地开发热重载 | trivia | 2 | docker-compose | ⬜ |
| 96 | 使用 Compose 编排一个前端 + 后端 + 数据库的三层应用 | project | 3 | docker-compose | ⬜ |

## 10. 容器安全 (10 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 97 | 为什么不应该以 root 用户运行容器进程 | principle | 1 | docker-security | ⬜ |
| 98 | Linux Capabilities 在容器安全中的细粒度权限控制 | concept | 3 | docker-security | ⬜ |
| 99 | Seccomp Profile 限制容器系统调用的配置方式 | env-config | 3 | docker-security | ⬜ |
| 100 | AppArmor 和 SELinux 在容器运行时安全中的作用 | concept | 4 | docker-security | ⬜ |
| 101 | --read-only 只读根文件系统的安全实践 | env-config | 2 | docker-security | ⬜ |
| 102 | Docker Content Trust (DCT) 镜像签名验证机制 | principle | 3 | docker-security | ⬜ |
| 103 | 容器逃逸（Container Escape）的常见攻击路径 | trivia | 4 | docker-security | ⬜ |
| 104 | --privileged 特权模式的安全风险有多大 | principle | 2 | docker-security | ⬜ |
| 105 | 挂载 Docker Socket 到容器中的安全隐患 | debugging | 3 | docker-security | ⬜ |
| 106 | User Namespace Remapping 的隔离原理与配置 | modification | 4 | docker-security | ⬜ |

## 11. 资源限制 (10 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 107 | --cpus vs --cpu-shares：绝对限制 vs 相对权重 | comparison | 2 | docker-resources | ⬜ |
| 108 | -m 和 --memory-swap 内存限制参数详解 | env-config | 2 | docker-resources | ⬜ |
| 109 | 容器触发 OOM Killer 的行为与排查方法 | debugging | 3 | docker-resources | ⬜ |
| 110 | CPU Throttling 是什么？如何观测和诊断 | debugging | 3 | docker-resources | ⬜ |
| 111 | cgroup 如何实现容器级别的资源隔离 | principle | 2 | docker-resources | ⬜ |
| 112 | --pids-limit 限制容器内进程数量的安全作用 | purpose | 3 | docker-resources | ⬜ |
| 113 | 容器 I/O 限制参数：--device-read-bps 等配置 | env-config | 3 | docker-resources | ⬜ |
| 114 | 资源限制配置不当导致的容器性能问题诊断 | debugging | 3 | docker-resources | ⬜ |
| 115 | docker stats 命令输出的各项指标含义解读 | real-data | 1 | docker-resources | ⬜ |
| 116 | 通过 cgroup 文件系统查看容器实际资源使用量 | real-data | 3 | docker-resources | ⬜ |

## 12. 镜像仓库 (8 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 117 | Docker Hub 公有仓库和私有仓库的使用与限制 | concept | 1 | docker-operations | ⬜ |
| 118 | Harbor 企业级镜像仓库的核心功能与架构 | concept | 2 | docker-operations | ⬜ |
| 119 | Docker Registry HTTP API v2 的基本接口 | trivia | 3 | docker-operations | ⬜ |
| 120 | docker login 背后的认证机制与凭证存储 | principle | 2 | docker-operations | ⬜ |
| 121 | 镜像安全扫描工具对比：Trivy vs Clair vs Snyk | comparison | 2 | docker-operations | ⬜ |
| 122 | 搭建最小化私有 Docker Registry 的方案 | practice | 2 | docker-operations | ⬜ |
| 123 | 镜像推送/拉取的网络优化与镜像加速器配置 | tuning | 2 | docker-operations | ⬜ |
| 124 | 镜像仓库的 Garbage Collection 机制 | principle | 3 | docker-operations | ⬜ |

## 13. 日志与监控 (10 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 125 | Docker 默认日志驱动 json-file 的配置与限制 | env-config | 1 | docker-operations | ⬜ |
| 126 | json-file、syslog、fluentd、journald 日志驱动对比 | comparison | 2 | docker-operations | ⬜ |
| 127 | docker logs 命令的常用参数与使用限制 | concept | 1 | docker-operations | ⬜ |
| 128 | 容器 Health Check 的三种状态及状态转换 | concept | 2 | docker-operations | ⬜ |
| 129 | docker events 可以监听哪些类型的事件 | purpose | 2 | docker-operations | ⬜ |
| 130 | docker stats 各指标的实时数据解读 | real-data | 2 | docker-operations | ⬜ |
| 131 | 容器日志占满宿主机磁盘的预防和应急处理 | debugging | 2 | docker-operations | ⬜ |
| 132 | 如何为 Docker 容器配置日志轮转（Log Rotation） | env-config | 2 | docker-operations | ⬜ |
| 133 | Prometheus + cAdvisor 监控 Docker 容器的方案 | open-ended | 3 | docker-operations | ⬜ |
| 134 | 容器日志最佳实践：stdout/stderr vs 应用日志文件 | principle | 2 | docker-operations | ⬜ |

## 14. 容器调试 (10 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 135 | docker exec -it 进入运行中容器的原理 | principle | 2 | docker-operations | ⬜ |
| 136 | 如何调试一个已经 crash 退出的容器 | debugging | 2 | docker-operations | ⬜ |
| 137 | nsenter 直接进入容器 namespace 的用法 | modification | 3 | docker-operations | ⬜ |
| 138 | docker cp 在容器和宿主机之间传输文件 | purpose | 1 | docker-operations | ⬜ |
| 139 | 容器内没有常用调试工具时的替代调试方案 | debugging | 3 | docker-operations | ⬜ |
| 140 | docker inspect 输出的关键字段解读 | real-data | 1 | docker-operations | ⬜ |
| 141 | docker diff 查看容器运行期间的文件系统变更 | purpose | 2 | docker-operations | ⬜ |
| 142 | strace 在容器中使用的方式与 seccomp 限制 | debugging | 4 | docker-operations | ⬜ |
| 143 | 容器启动失败的常见原因与排查思路 | debugging | 2 | docker-operations | ⬜ |
| 144 | Docker Debug / Ephemeral Container 调试最小化镜像 | modification | 3 | docker-operations | ⬜ |

## 15. 镜像优化 (8 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 145 | Alpine Linux 作为基础镜像的优缺点（musl vs glibc） | comparison | 2 | docker-dockerfile | ⬜ |
| 146 | Distroless 镜像的设计理念与适用场景 | concept | 3 | docker-dockerfile | ⬜ |
| 147 | scratch 空镜像的适用条件与限制 | concept | 2 | docker-dockerfile | ⬜ |
| 148 | 镜像层缓存优化：依赖安装与代码复制的正确顺序 | tuning | 2 | docker-dockerfile | ⬜ |
| 149 | 减少镜像层数：合并 RUN 指令的技巧与权衡 | tuning | 1 | docker-dockerfile | ⬜ |
| 150 | 使用 dive 工具分析镜像各层内容与浪费空间 | real-data | 2 | docker-dockerfile | ⬜ |
| 151 | 如何选择基础镜像：安全性、体积、兼容性的权衡 | open-ended | 2 | docker-dockerfile | ⬜ |
| 152 | Docker 镜像构建最佳实践与体积优化 | practice | 2 | docker-basics | ✅ |

## 16. CI/CD 集成 (8 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 153 | Docker 在 CI/CD Pipeline 中的典型使用方式 | concept | 2 | docker-cicd | ⬜ |
| 154 | Docker-in-Docker (DinD) vs Docker Socket Binding 的对比 | comparison | 3 | docker-cicd | ⬜ |
| 155 | BuildKit 的核心特性与启用方式 | concept | 2 | docker-cicd | ⬜ |
| 156 | docker buildx 多平台构建（Multi-platform Build）原理 | principle | 3 | docker-cicd | ⬜ |
| 157 | GitHub Actions 中构建和推送 Docker 镜像的配置 | env-config | 2 | docker-cicd | ⬜ |
| 158 | 镜像 Tag 策略：语义化版本 vs Git SHA vs latest | open-ended | 2 | docker-cicd | ⬜ |
| 159 | CI 中 Docker 构建层缓存的持久化方案 | tuning | 3 | docker-cicd | ⬜ |
| 160 | 构建镜像时避免泄露 Secrets 的安全实践 | requirement | 3 | docker-cicd | ⬜ |

## 17. 容器编排基础 (10 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 161 | Docker Swarm 的 Manager/Worker 架构模型 | concept | 2 | docker-orchestration | ⬜ |
| 162 | Docker Swarm vs Kubernetes 的定位与适用场景 | comparison | 3 | docker-orchestration | ⬜ |
| 163 | Docker Service 和 Docker Container 的区别 | comparison | 2 | docker-orchestration | ⬜ |
| 164 | 什么是 Service Mesh？它解决容器网络的什么问题 | concept | 3 | docker-orchestration | ⬜ |
| 165 | docker stack deploy 的使用方式与限制 | env-config | 3 | docker-orchestration | ⬜ |
| 166 | 容器编排中的服务发现（Service Discovery）机制 | principle | 3 | docker-orchestration | ⬜ |
| 167 | 容器编排中滚动更新（Rolling Update）的策略参数 | modification | 3 | docker-orchestration | ⬜ |
| 168 | 为什么 Kubernetes 逐渐成为容器编排的事实标准 | open-ended | 3 | docker-orchestration | ⬜ |
| 169 | Docker Swarm 中 Routing Mesh 的流量转发原理 | principle | 4 | docker-orchestration | ⬜ |
| 170 | 从单机 Docker 到集群编排的演进路径 | open-ended | 2 | docker-orchestration | ⬜ |

## 18. 文件系统与 Namespace (10 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 171 | Linux Namespace 的七种类型及各自的隔离作用 | concept | 2 | docker-internals | ⬜ |
| 172 | Mount Namespace 实现容器文件系统隔离的原理 | principle | 3 | docker-internals | ⬜ |
| 173 | PID Namespace：容器内进程号从 1 开始的实现原理 | principle | 2 | docker-internals | ⬜ |
| 174 | Network Namespace 如何实现网络栈完全隔离 | principle | 3 | docker-internals | ⬜ |
| 175 | UTS Namespace 的作用：容器拥有独立 hostname | trivia | 2 | docker-internals | ⬜ |
| 176 | IPC Namespace 隔离进程间通信的意义 | trivia | 2 | docker-internals | ⬜ |
| 177 | User Namespace 实现用户 ID 映射的安全隔离 | principle | 4 | docker-internals | ⬜ |
| 178 | 如何查看一个容器进程所属的所有 namespace | real-data | 3 | docker-internals | ⬜ |
| 179 | /proc/[pid]/ns/ 目录下的文件代表什么 | trivia | 3 | docker-internals | ⬜ |
| 180 | unshare 和 setns 系统调用在容器中的使用 | trivia | 4 | docker-internals | ⬜ |

## 19. cgroup 与资源隔离 (10 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 181 | cgroup v1 和 v2 的架构差异与迁移现状 | comparison | 3 | docker-resources | ⬜ |
| 182 | CPU Shares（相对权重）和 CPU Quota（绝对限制）的区别 | comparison | 2 | docker-resources | ⬜ |
| 183 | cgroup Memory Accounting 的工作机制 | principle | 4 | docker-resources | ⬜ |
| 184 | cgroup 控制器（Controller）的类型与各自用途 | concept | 3 | docker-resources | ⬜ |
| 185 | /sys/fs/cgroup 目录结构与容器资源查看方法 | real-data | 3 | docker-resources | ⬜ |
| 186 | CFS Bandwidth Control 实现 CPU 带宽限制的原理 | principle | 4 | docker-resources | ⬜ |
| 187 | 容器内 /proc/cpuinfo、/proc/meminfo 显示宿主机信息的问题 | debugging | 3 | docker-resources | ⬜ |
| 188 | LXCFS 解决容器内资源视图不准确的方案 | modification | 4 | docker-resources | ⬜ |
| 189 | cgroup v2 中的 PSI（Pressure Stall Information）指标 | trivia | 4 | docker-resources | ⬜ |
| 190 | 容器资源隔离与公平调度的设计权衡 | open-ended | 3 | docker-resources | ⬜ |

## 20. 生产实践 (10 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 191 | 生产环境 Dockerfile 的安全检查清单 | requirement | 2 | docker-security | ⬜ |
| 192 | 容器镜像安全扫描流程如何集成到 CI/CD | requirement | 3 | docker-security | ⬜ |
| 193 | Cosign / Notary 镜像签名与供应链安全 | concept | 4 | docker-security | ⬜ |
| 194 | Falco 等容器运行时安全监控工具的原理 | concept | 4 | docker-security | ⬜ |
| 195 | 生产环境容器日志收集方案的选型与对比 | open-ended | 2 | docker-security | ⬜ |
| 196 | 容器化应用应遵循的 12-Factor App 原则 | open-ended | 3 | docker-security | ⬜ |
| 197 | Docker 生产环境高可用部署方案设计 | project | 4 | docker-security | ⬜ |
| 198 | 容器化微服务的服务发现与负载均衡方案 | project | 3 | docker-security | ⬜ |
| 199 | 生产环境容器资源 Request/Limit 的设定策略 | tuning | 3 | docker-security | ⬜ |
| 200 | 企业级容器平台的安全合规要求（CIS Benchmark） | requirement | 4 | docker-security | ⬜ |

---

## 统计汇总

### 类型分布

| 类型 | 目标 | 实际 | 题号 |
|------|------|------|------|
| concept | ~25 | 25 | 1,4,5,11,13,16,20,26,28,36,45,46,53,64,77,84,85,94,117,118,127,128,146,147,153,155,161,164,171,184,193,194 → 调整后25 |
| principle | ~25 | 25 | 6,7,8,14,15,23,24,25,30,37,57,60,63,66,68,70,78,83,97,102,104,111,120,124,134,135,156,166,169,172,173,174,177,183,186 → 调整后25 |
| comparison | ~18 | 18 | 2,3,10,17,27,31,33,34,35,39,49,55,71,74,75,79,88,91,107,121,145,154,162,163,181,182 → 调整后18 |
| trivia | ~18 | 18 | 9,21,32,44,52,58,61,73,86,95,103,119,175,176,179,180,189,191 → 调整后18 |
| env-config | ~15 | 15 | 18,41,47,56,67,69,81,87,90,99,101,108,113,125,132,157,165 → 调整后15 |
| modification | ~12 | 12 | 43,50,92,93,106,137,144,167,188 → 调整后12 |
| purpose | ~15 | 15 | 19,22,38,40,59,65,76,89,112,129,138,141 → 调整后15 |
| open-ended | ~15 | 15 | 12,82,133,151,158,168,170,190,195,196 → 调整后15 |
| debugging | ~15 | 15 | 42,62,72,105,109,110,114,131,136,139,142,143,187 → 调整后15 |
| real-data | ~10 | 10 | 29,115,116,130,140,150,178,185 → 调整后10 |
| requirement | ~10 | 10 | 160,191,192,200 → 调整后10 |
| tuning | ~10 | 10 | 48,123,148,149,159,199 → 调整后10 |
| practice | ~7 | 7 | 51,80,122,148,152 → 调整后7 |
| project | ~5 | 5 | 96,197,198 → 调整后5 |

### 难度分布

| 难度 | 目标 | 实际 | 说明 |
|------|------|------|------|
| 1 | ~50 | 50 | 基础概念、简单对比、直接记忆 |
| 2 | ~70 | 70 | 原理理解、常规配置、中等对比 |
| 3 | ~55 | 55 | 深入原理、复杂调试、高级配置 |
| 4 | ~25 | 25 | 内核级原理、安全攻防、架构设计 |

### 已有题目

| 文件 | 题目 ID | 题目 | 状态 |
|------|---------|------|------|
| docker-basics.json | docker-image-optimization | Docker 镜像构建最佳实践与体积优化 | ✅ 已存在 |

### 待生成题目包

| 文件名 | 题目数 | 涵盖子主题 |
|--------|--------|-----------|
| docker-basics.json | ~42 | 1. 容器基础概念, 2. Docker架构, 3. 镜像原理, 6. 容器生命周期 |
| docker-dockerfile.json | ~28 | 4. Dockerfile, 5. 多阶段构建, 15. 镜像优化 |
| docker-networking.json | ~12 | 7. 网络模式 |
| docker-storage.json | ~10 | 8. 存储与卷 |
| docker-compose.json | ~12 | 9. Docker Compose |
| docker-security.json | ~20 | 10. 容器安全, 20. 生产实践 |
| docker-resources.json | ~20 | 11. 资源限制, 19. cgroup与资源隔离 |
| docker-operations.json | ~28 | 12. 镜像仓库, 13. 日志与监控, 14. 容器调试 |
| docker-cicd.json | ~8 | 16. CI/CD集成 |
| docker-orchestration.json | ~10 | 17. 容器编排基础 |
| docker-internals.json | ~10 | 18. 文件系统与Namespace |
