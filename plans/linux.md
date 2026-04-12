# Linux 面试题子计划

> 领域: linux | 目标: ~200 题 | 状态: 规划中
> 已有题包: (当前为空)
> 难度分布: ⭐×50 | ⭐⭐×70 | ⭐⭐⭐×55 | ⭐⭐⭐⭐×25
> 类型分布: concept×25 | principle×25 | comparison×18 | trivia×18 | env-config×15 | modification×12 | purpose×15 | open-ended×15 | debugging×15 | real-data×10 | requirement×10 | tuning×10 | practice×7 | project×5

---

## 1. 文件与目录 (file types, permissions, hard/soft links, FHS, find/locate)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 1 | Linux 中文件类型有哪几种？如何用 ls -l 区分 | concept | 1 | — | 🔲 |
| 2 | 硬链接与软链接(soft link)有什么区别？ | comparison | 1 | — | 🔲 |
| 3 | Linux FHS（Filesystem Hierarchy Standard）的设计原理与目录规范 | principle | 1 | — | 🔲 |
| 4 | find 命令的常用搜索条件有哪些？ | trivia | 1 | — | 🔲 |
| 5 | find 与 locate 的区别及各自适用场景 | comparison | 2 | — | 🔲 |
| 6 | Linux 中 inode 的概念及 inode 耗尽的影响 | concept | 2 | — | 🔲 |
| 7 | umask 的作用及默认值 022 的含义 | concept | 1 | — | 🔲 |
| 8 | stat 命令输出中 Access/Modify/Change 三个时间戳的区别 | trivia | 2 | — | 🔲 |
| 9 | 如何递归修改目录下所有文件权限但不影响子目录？ | practice | 2 | — | 🔲 |
| 10 | /proc 和 /sys 目录分别存放什么内容？ | purpose | 2 | — | 🔲 |
| 11 | 如何找出系统中所有大于 100MB 的文件并按大小排序？ | debugging | 2 | — | 🔲 |
| 12 | 文件权限中特殊权限位 SUID/SGID/Sticky Bit 各自的作用 | concept | 2 | — | 🔲 |

---

## 2. 用户与权限 (user/group, chmod, chown, sudo, PAM, ACL)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 13 | /etc/passwd 与 /etc/shadow 的内容结构分别是什么？ | concept | 1 | — | 🔲 |
| 14 | sudo 与 su 命令的区别 | comparison | 1 | — | 🔲 |
| 15 | PAM（Pluggable Authentication Modules）认证框架的工作原理 | principle | 3 | — | 🔲 |
| 16 | ACL 相比传统 UGO 权限模型有哪些优势？ | comparison | 2 | — | 🔲 |
| 17 | 如何创建一个无法登录的系统账户？ | env-config | 1 | — | 🔲 |
| 18 | visudo 的作用及安全编辑机制 | purpose | 2 | — | 🔲 |
| 19 | 如何限制 sudo 用户只能执行特定命令？ | modification | 3 | — | 🔲 |
| 20 | /etc/login.defs 中有哪些重要的安全配置项？ | trivia | 2 | — | 🔲 |
| 21 | chown 与 chgrp 的使用场景区别 | trivia | 1 | — | 🔲 |
| 22 | 用户密码过期策略如何配置？(chage/passwd) | env-config | 2 | — | 🔲 |
| 23 | 排查 Permission denied 错误的系统化思路 | debugging | 2 | — | 🔲 |
| 24 | 如何用 getfacl/setfacl 配置文件的 ACL 权限？ | modification | 2 | — | 🔲 |

---

## 3. Shell 基础 (bash, environment variables, alias, history, job control)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 25 | 环境变量与本地变量的区别及作用域 | concept | 1 | — | 🔲 |
| 26 | $PATH 的作用及永久添加新路径的方法 | env-config | 1 | — | 🔲 |
| 27 | alias 的定义与持久化方法 | env-config | 1 | — | 🔲 |
| 28 | Bash 中单引号与双引号的区别 | comparison | 1 | — | 🔲 |
| 29 | login shell 与 non-login shell 加载配置文件的区别 | principle | 2 | — | 🔲 |
| 30 | history 命令的常用技巧与安全配置(HISTSIZE/HISTCONTROL) | trivia | 1 | — | 🔲 |
| 31 | 前台/后台进程切换与 job control 基本操作(fg/bg/&/Ctrl-Z) | concept | 2 | — | 🔲 |
| 32 | Bash 通配符(globbing)与正则表达式的区别 | comparison | 2 | — | 🔲 |
| 33 | source 命令与直接执行脚本的区别 | comparison | 1 | — | 🔲 |
| 34 | .bashrc / .bash_profile / /etc/profile 的加载顺序 | principle | 2 | — | 🔲 |

---

## 4. Shell 脚本 (variables, conditions, loops, functions, set -e, trap)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 35 | Shell 脚本中 $? / $# / $@ / $* 各代表什么？ | trivia | 1 | — | 🔲 |
| 36 | if 语句中 [ ] 与 [[ ]] 的区别 | comparison | 2 | — | 🔲 |
| 37 | for 循环遍历文件列表的常见写法 | concept | 1 | — | 🔲 |
| 38 | Shell 函数的定义方式与返回值机制 | concept | 2 | — | 🔲 |
| 39 | set -e 和 set -o pipefail 的作用与使用场景 | purpose | 2 | — | 🔲 |
| 40 | trap 命令捕获信号的原理与清理操作 | principle | 3 | — | 🔲 |
| 41 | here document（<<EOF）的用法及适用场景 | concept | 1 | — | 🔲 |
| 42 | Shell 脚本调试方法：bash -x 与 set -x 的使用 | debugging | 2 | — | 🔲 |
| 43 | 如何编写健壮的自动备份 Shell 脚本？ | open-ended | 3 | — | 🔲 |
| 44 | getopts 处理命令行参数的方法 | modification | 2 | — | 🔲 |
| 45 | Shell 中数组的定义与常用操作方法 | trivia | 1 | — | 🔲 |
| 46 | 如何用 Shell 脚本实现简单的配置文件解析？ | practice | 3 | — | 🔲 |

---

## 5. 文本处理 (grep, sed, awk, sort, uniq, cut, tr, xargs)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 47 | grep 常用选项（-i / -r / -v / -E / -c）的作用 | trivia | 1 | — | 🔲 |
| 48 | sed 基本替换语法与常用 flag（g / i / p） | concept | 1 | — | 🔲 |
| 49 | awk 的工作原理：BEGIN / 主体 / END 块 | principle | 2 | — | 🔲 |
| 50 | sort 与 uniq 组合去重的使用技巧 | trivia | 1 | — | 🔲 |
| 51 | cut 与 tr 命令的典型使用场景 | purpose | 1 | — | 🔲 |
| 52 | xargs 的作用及与管道直接传参的区别 | comparison | 2 | — | 🔲 |
| 53 | 用 awk 统计 Nginx 日志中各 HTTP 状态码出现次数 | real-data | 3 | — | 🔲 |
| 54 | sed 多行匹配和替换的高级用法 | modification | 3 | — | 🔲 |
| 55 | 正则表达式中贪婪匹配与非贪婪匹配的区别 | principle | 2 | — | 🔲 |
| 56 | 用文本处理工具链提取 CSV 特定列并去重排序 | practice | 3 | — | 🔲 |

---

## 6. 进程管理 (ps, top, htop, kill, nice, nohup, systemctl)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 57 | 进程与线程的区别是什么？ | concept | 1 | — | 🔲 |
| 58 | ps aux 与 ps -ef 输出格式的区别 | comparison | 1 | — | 🔲 |
| 59 | top 命令中 load average / %wa / %si 等指标的含义 | real-data | 2 | — | 🔲 |
| 60 | kill / kill -9 / killall 的区别与使用注意事项 | trivia | 1 | — | 🔲 |
| 61 | nice 与 renice 如何调整进程优先级？ | purpose | 2 | — | 🔲 |
| 62 | nohup 与 disown 的区别 | comparison | 2 | — | 🔲 |
| 63 | zombie 进程（僵尸进程）的产生原因与清理方法 | principle | 2 | — | 🔲 |
| 64 | orphan 进程与 zombie 进程的区别 | concept | 2 | — | 🔲 |
| 65 | /proc/\<pid\>/ 目录下有哪些常用文件及其作用？ | trivia | 2 | — | 🔲 |
| 66 | 如何定位并分析 CPU 占用最高的进程？ | debugging | 3 | — | 🔲 |
| 67 | Linux 信号（signal）机制的工作原理 | principle | 3 | — | 🔲 |
| 68 | D 状态进程（不可中断睡眠）的含义与排查方法 | debugging | 3 | — | 🔲 |

---

## 7. 网络工具 (ifconfig/ip, netstat/ss, curl, wget, dig, nslookup, iptables)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 69 | ifconfig 与 ip 命令的功能对比及迁移趋势 | comparison | 1 | — | 🔲 |
| 70 | netstat 与 ss 命令的区别及常用选项 | comparison | 1 | — | 🔲 |
| 71 | curl 常用选项及发送 POST 请求的写法 | trivia | 1 | — | 🔲 |
| 72 | wget 断点续传与递归下载的使用方法 | trivia | 1 | — | 🔲 |
| 73 | dig 与 nslookup 查询 DNS 的区别 | comparison | 2 | — | 🔲 |
| 74 | tcpdump 抓包过滤语法及常用示例 | concept | 3 | — | 🔲 |
| 75 | iptables 四表五链模型详解 | principle | 3 | — | 🔲 |
| 76 | 如何用 curl 测试 REST API 并分析响应头？ | practice | 2 | — | 🔲 |
| 77 | traceroute / mtr 如何诊断网络延迟问题？ | debugging | 2 | — | 🔲 |
| 78 | ping 不通但端口可达是什么原因？排查思路 | debugging | 2 | — | 🔲 |

---

## 8. 网络配置 (network interfaces, routing, DNS, firewalld, nftables)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 79 | Linux 中配置静态 IP 地址的几种方法 | env-config | 1 | — | 🔲 |
| 80 | 路由表（routing table）查看与静态路由配置 | env-config | 2 | — | 🔲 |
| 81 | /etc/resolv.conf 中 DNS 配置项的含义 | concept | 1 | — | 🔲 |
| 82 | firewalld 的 zone 概念与基本操作 | concept | 2 | — | 🔲 |
| 83 | nftables 相比 iptables 有哪些改进？ | comparison | 3 | — | 🔲 |
| 84 | Linux 网络 namespace 的工作原理与操作方法 | principle | 3 | — | 🔲 |
| 85 | 网桥（bridge）与 veth pair 的工作原理 | principle | 3 | — | 🔲 |
| 86 | 如何配置 Linux 作为 NAT 网关？ | env-config | 3 | — | 🔲 |
| 87 | bonding / teaming 网卡绑定的模式与选择 | concept | 3 | — | 🔲 |
| 88 | Linux 中 VLAN 的配置方法 | env-config | 3 | — | 🔲 |

---

## 9. 磁盘与存储 (fdisk, LVM, RAID, df, du, mount, fstab, iSCSI)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 89 | fdisk 与 parted 分区工具的区别 | comparison | 1 | — | 🔲 |
| 90 | LVM 的三层架构（PV / VG / LV）概念详解 | concept | 2 | — | 🔲 |
| 91 | RAID 0 / 1 / 5 / 10 的特点与选择依据 | concept | 2 | — | 🔲 |
| 92 | df 与 du 结果不一致的原因分析 | debugging | 1 | — | 🔲 |
| 93 | /etc/fstab 的配置格式与常用挂载选项 | env-config | 1 | — | 🔲 |
| 94 | 如何在线扩展 LVM 逻辑卷？ | modification | 2 | — | 🔲 |
| 95 | swap 空间的作用及动态添加方法 | purpose | 2 | — | 🔲 |
| 96 | iSCSI 的基本概念与 Linux 中的配置方法 | concept | 3 | — | 🔲 |
| 97 | fio 工具进行磁盘 I/O 性能基准测试 | real-data | 3 | — | 🔲 |
| 98 | 磁盘空间满（disk full）问题的排查流程 | debugging | 2 | — | 🔲 |
| 99 | LVM snapshot（快照）的原理与使用场景 | principle | 3 | — | 🔲 |
| 100 | MBR 与 GPT 分区表的区别 | comparison | 1 | — | 🔲 |

---

## 10. 文件系统 (ext4, xfs, btrfs, tmpfs, proc, sysfs)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 101 | ext4 文件系统的特点及 journal 机制 | concept | 1 | — | 🔲 |
| 102 | xfs 与 ext4 的性能对比与适用场景 | comparison | 2 | — | 🔲 |
| 103 | btrfs 写时复制（CoW）与快照机制 | principle | 3 | — | 🔲 |
| 104 | tmpfs 的作用及与磁盘文件系统的区别 | purpose | 1 | — | 🔲 |
| 105 | /proc 文件系统中的常用文件及其作用 | trivia | 1 | — | 🔲 |
| 106 | sysfs 暴露的内核信息类型与使用方式 | trivia | 2 | — | 🔲 |
| 107 | fsck 文件系统修复工具的使用方法与注意事项 | debugging | 2 | — | 🔲 |
| 108 | superblock 的作用及损坏后的恢复方法 | principle | 3 | — | 🔲 |
| 109 | overlay filesystem 的分层原理 | principle | 3 | — | 🔲 |
| 110 | 挂载选项 noatime / noexec / nosuid 各有什么作用？ | trivia | 2 | — | 🔲 |

---

## 11. 系统监控 (vmstat, iostat, sar, dstat, perf, strace, ltrace)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 111 | vmstat 各列指标的含义及如何判断异常 | real-data | 2 | — | 🔲 |
| 112 | iostat 如何分析磁盘 I/O 瓶颈？ | real-data | 2 | — | 🔲 |
| 113 | sar 命令能收集哪些系统性能数据？ | trivia | 2 | — | 🔲 |
| 114 | dstat 的优势与常用监控选项组合 | purpose | 2 | — | 🔲 |
| 115 | perf 工具进行 CPU 性能热点分析 | real-data | 3 | — | 🔲 |
| 116 | strace 的作用及系统调用跟踪方法 | concept | 2 | — | 🔲 |
| 117 | ltrace 与 strace 的区别是什么？ | trivia | 2 | — | 🔲 |
| 118 | 综合 vmstat / iostat / sar 判断系统瓶颈类型 | open-ended | 3 | — | 🔲 |
| 119 | /proc/meminfo 各字段的含义与内存分析方法 | real-data | 3 | — | 🔲 |
| 120 | 实时监控系统网络流量的工具与方法（iftop / nethogs） | purpose | 2 | — | 🔲 |

---

## 12. 内核参数 (sysctl, /proc/sys, ulimit, cgroups v1/v2)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 121 | sysctl 的作用及常用可调内核参数有哪些？ | concept | 2 | — | 🔲 |
| 122 | /proc/sys 目录结构与 sysctl 配置的对应关系 | principle | 2 | — | 🔲 |
| 123 | ulimit 的作用及如何永久修改用户资源限制 | env-config | 1 | — | 🔲 |
| 124 | cgroups v1 与 v2 的架构演进与核心区别 | principle | 3 | — | 🔲 |
| 125 | 如何用 cgroups 限制进程的 CPU 和内存使用？ | modification | 3 | — | 🔲 |
| 126 | vm.swappiness 参数的含义与调优建议 | tuning | 2 | — | 🔲 |
| 127 | net.core.somaxconn 等网络相关内核参数的调优 | tuning | 3 | — | 🔲 |
| 128 | sysctl 参数修改的持久化方法（/etc/sysctl.d/） | env-config | 1 | — | 🔲 |

---

## 13. systemd (unit files, service management, journal, timer, target)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 129 | systemd 相比 SysVinit 的设计优势 | principle | 2 | — | 🔲 |
| 130 | systemd unit 文件的常见类型（.service / .socket / .timer 等） | concept | 1 | — | 🔲 |
| 131 | 编写自定义 systemd service 文件的关键字段 | modification | 2 | — | 🔲 |
| 132 | systemctl 的 enable 与 start 有什么区别？ | purpose | 1 | — | 🔲 |
| 133 | journalctl 日志查询与时间范围过滤技巧 | purpose | 1 | — | 🔲 |
| 134 | systemd timer 与 cron 定时任务的对比 | principle | 2 | — | 🔲 |
| 135 | target 与传统 runlevel 的对应关系及切换方法 | concept | 2 | — | 🔲 |
| 136 | 用 systemctl 和 journalctl 排查服务启动失败 | debugging | 2 | — | 🔲 |
| 137 | systemd 中 After / Requires / Wants 依赖关系的工作方式 | principle | 3 | — | 🔲 |
| 138 | 配置 systemd 服务自动重启与 StartLimitBurst 速率限制 | modification | 3 | — | 🔲 |

---

## 14. 包管理 (apt, yum/dnf, rpm, dpkg, dependency resolution)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 139 | apt 与 yum/dnf 的基本命令对比 | purpose | 1 | — | 🔲 |
| 140 | rpm 与 dpkg 底层包操作的异同 | purpose | 1 | — | 🔲 |
| 141 | 包管理器依赖解析（dependency resolution）的原理 | principle | 2 | — | 🔲 |
| 142 | 如何配置本地 yum/apt 软件仓库？ | env-config | 3 | — | 🔲 |
| 143 | 如何查询某个文件属于哪个已安装的软件包？ | debugging | 1 | — | 🔲 |
| 144 | 包管理器的 GPG 签名验证机制 | principle | 3 | — | 🔲 |
| 145 | dnf history 回滚与 apt 版本管理机制 | principle | 2 | — | 🔲 |
| 146 | 生产环境软件包更新策略应考虑哪些因素？ | open-ended | 3 | — | 🔲 |

---

## 15. 日志管理 (syslog, rsyslog, journald, logrotate)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 147 | syslog 协议中 facility 与 severity 的概念 | purpose | 1 | — | 🔲 |
| 148 | rsyslog 配置文件结构与常用过滤规则 | env-config | 2 | — | 🔲 |
| 149 | journald 与传统 syslog 的区别及共存方式 | principle | 2 | — | 🔲 |
| 150 | logrotate 的配置方法与常用选项 | env-config | 2 | — | 🔲 |
| 151 | 多台服务器日志集中收集方案设计 | open-ended | 3 | — | 🔲 |
| 152 | 从海量日志中快速定位问题的方法与工具 | debugging | 3 | — | 🔲 |
| 153 | /var/log 下常见日志文件（messages / secure / dmesg）及其用途 | purpose | 1 | — | 🔲 |
| 154 | auditd 审计日志的规则配置方法 | modification | 3 | — | 🔲 |

---

## 16. SSH 与远程 (ssh config, key auth, tunnel, scp, rsync)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 155 | SSH 密钥认证的完整工作流程是怎样的？ | open-ended | 1 | — | 🔲 |
| 156 | ssh_config 常用配置项与多主机管理技巧 | env-config | 2 | — | 🔲 |
| 157 | SSH 端口转发（tunnel）的三种模式及应用场景 | open-ended | 3 | — | 🔲 |
| 158 | rsync 增量同步原理及与 scp 的区别 | open-ended | 2 | — | 🔲 |
| 159 | SSH 服务安全加固的最佳实践 | modification | 2 | — | 🔲 |
| 160 | SSH 免密登录的完整配置步骤与常见问题排查 | practice | 2 | — | 🔲 |
| 161 | SSH agent forwarding 的原理与安全注意事项 | open-ended | 3 | — | 🔲 |
| 162 | 通过 ProxyJump 跳板机连接内网服务器的配置 | modification | 3 | — | 🔲 |
| 163 | SSH 连接超时或断开的排查方法 | debugging | 3 | — | 🔲 |
| 164 | 远程服务器批量管理方案对比（Ansible / pssh / pdsh） | open-ended | 3 | — | 🔲 |

---

## 17. 性能调优 (CPU tuning, memory tuning, disk I/O scheduling, network tuning)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 165 | Linux 性能分析的 USE 方法论基本思路 | open-ended | 3 | — | 🔲 |
| 166 | CFS 调度器的基本原理与参数调节 | tuning | 3 | — | 🔲 |
| 167 | huge pages 的作用与配置方法 | tuning | 3 | — | 🔲 |
| 168 | 磁盘 I/O 调度器（mq-deadline / none / bfq）的选择策略 | tuning | 3 | — | 🔲 |
| 169 | TCP 参数调优（backlog / keepalive / buffer size）最佳实践 | tuning | 4 | — | 🔲 |
| 170 | 用 systemd-analyze 分析和优化系统启动时间 | real-data | 3 | — | 🔲 |
| 171 | 内存泄漏（memory leak）的检测与定位方法 | debugging | 4 | — | 🔲 |
| 172 | 高并发场景下 Linux 内核参数的调优方向 | tuning | 4 | — | 🔲 |
| 173 | 用 flame graph 分析 CPU 性能热点 | real-data | 4 | — | 🔲 |
| 174 | 数据库服务器（MySQL / PostgreSQL）系统层面的调优要点 | open-ended | 4 | — | 🔲 |

---

## 18. 安全加固 (SELinux, AppArmor, firewall, fail2ban, audit)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 175 | SELinux 三种模式及上下文（context）/ 布尔值（boolean）概念 | requirement | 3 | — | 🔲 |
| 176 | AppArmor 与 SELinux 的对比与选择 | requirement | 3 | — | 🔲 |
| 177 | fail2ban 的工作原理与 SSH 防暴力破解配置 | requirement | 3 | — | 🔲 |
| 178 | Linux 系统安全加固的标准 Checklist 有哪些？ | open-ended | 3 | — | 🔲 |
| 179 | auditd 审计规则的编写与应用 | requirement | 3 | — | 🔲 |
| 180 | 如何检测系统是否被入侵？rootkit 检测方法 | requirement | 4 | — | 🔲 |
| 181 | 文件完整性监控（AIDE / Tripwire）的原理与部署 | requirement | 4 | — | 🔲 |
| 182 | Linux 常见提权漏洞类型及防范措施 | open-ended | 4 | — | 🔲 |
| 183 | 最小权限原则在 Linux 运维中如何实践？ | requirement | 3 | — | 🔲 |
| 184 | 生产环境防火墙网络隔离策略设计 | requirement | 4 | — | 🔲 |

---

## 19. 容器基础 (namespace, cgroup, overlay filesystem — Linux primitives for containers)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 185 | 容器隔离需要哪些 Linux namespace 支持？六种类型详解 | requirement | 4 | — | 🔲 |
| 186 | cgroup 在容器资源限制中的作用与配置方法 | tuning | 4 | — | 🔲 |
| 187 | overlay filesystem 在容器镜像分层中如何平衡性能与存储？ | open-ended | 4 | — | 🔲 |
| 188 | 容器与虚拟机的本质区别（从 Linux 内核角度） | requirement | 4 | — | 🔲 |
| 189 | 用 unshare 命令手动创建简单容器的实验 | practice | 4 | — | 🔲 |
| 190 | 容器网络模型（bridge / host / none）在 Linux 层面的实现原理 | project | 4 | — | 🔲 |
| 191 | 如何修改运维脚本以适配容器化环境？ | modification | 4 | — | 🔲 |
| 192 | 设计生产环境的容器日志收集方案 | project | 4 | — | 🔲 |

---

## 20. 启动流程 (BIOS/UEFI, GRUB, initramfs, init/systemd, runlevel/target)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 193 | Linux 完整启动流程详解（BIOS/UEFI → GRUB → kernel → init） | open-ended | 4 | — | 🔲 |
| 194 | GRUB2 引导参数的调优与故障恢复 | tuning | 4 | — | 🔲 |
| 195 | initramfs 的定制与启动性能优化 | tuning | 4 | — | 🔲 |
| 196 | 设计基于 systemd 的服务编排启动方案 | project | 4 | — | 🔲 |
| 197 | 从 Legacy BIOS 迁移到 UEFI 引导的实操步骤 | practice | 4 | — | 🔲 |
| 198 | 设计多内核/多系统的 GRUB 引导管理方案 | project | 4 | — | 🔲 |
| 199 | 实际案例：系统启动失败的 rescue mode / emergency mode 修复过程 | real-data | 4 | — | 🔲 |
| 200 | 设计一套 Linux 启动流程监控与优化方案 | project | 4 | — | 🔲 |

---

## 统计汇总

### 类型分布

| 类型 | 目标 | 实际 |
|------|------|------|
| concept | 25 | 25 |
| principle | 25 | 25 |
| comparison | 18 | 18 |
| trivia | 18 | 18 |
| env-config | 15 | 15 |
| modification | 12 | 12 |
| purpose | 15 | 15 |
| open-ended | 15 | 15 |
| debugging | 15 | 15 |
| real-data | 10 | 10 |
| requirement | 10 | 10 |
| tuning | 10 | 10 |
| practice | 7 | 7 |
| project | 5 | 5 |
| **合计** | **200** | **200** |

### 难度分布

| 难度 | 目标 | 实际 |
|------|------|------|
| ⭐1 | 50 | 50 |
| ⭐⭐2 | 70 | 70 |
| ⭐⭐⭐3 | 55 | 55 |
| ⭐⭐⭐⭐4 | 25 | 25 |
| **合计** | **200** | **200** |

### 子主题分布

| # | 子主题 | 题数 |
|---|--------|------|
| 1 | 文件与目录 | 12 |
| 2 | 用户与权限 | 12 |
| 3 | Shell 基础 | 10 |
| 4 | Shell 脚本 | 12 |
| 5 | 文本处理 | 10 |
| 6 | 进程管理 | 12 |
| 7 | 网络工具 | 10 |
| 8 | 网络配置 | 10 |
| 9 | 磁盘与存储 | 12 |
| 10 | 文件系统 | 10 |
| 11 | 系统监控 | 10 |
| 12 | 内核参数 | 8 |
| 13 | systemd | 10 |
| 14 | 包管理 | 8 |
| 15 | 日志管理 | 8 |
| 16 | SSH 与远程 | 10 |
| 17 | 性能调优 | 10 |
| 18 | 安全加固 | 10 |
| 19 | 容器基础 | 8 |
| 20 | 启动流程 | 8 |
| | **合计** | **200** |
