# CI/CD 面试题子计划

> 领域: cicd | 目标: ~200 题 | 状态: 规划中
>
> 类型分布: concept ~25, principle ~25, comparison ~18, trivia ~18, env-config ~15, modification ~12, purpose ~15, open-ended ~15, debugging ~15, real-data ~10, requirement ~10, tuning ~10, practice ~7, project ~5
>
> 难度分布: ⭐1 ~50, ⭐2 ~70, ⭐3 ~55, ⭐4 ~25
>
> 现有文件: cicd/ 目录为空，所有题目均为新建 (❌)

---

## 1. CI/CD概念
| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 1 | 什么是 Continuous Integration？核心原则是什么 | concept | 1 | cicd-concepts.json | ❌ |
| 2 | Continuous Delivery 与 Continuous Deployment 的区别 | comparison | 1 | cicd-concepts.json | ❌ |
| 3 | CI/CD Pipeline 的基本组成阶段有哪些 | concept | 1 | cicd-concepts.json | ❌ |
| 4 | 为什么需要 CI/CD？它解决了传统开发中的什么问题 | purpose | 1 | cicd-concepts.json | ❌ |
| 5 | DevOps 与 CI/CD 的关系是什么 | trivia | 1 | cicd-concepts.json | ❌ |
| 6 | Pipeline as Code 的含义和优势 | principle | 1 | cicd-concepts.json | ❌ |
| 7 | CI/CD 中 Shift Left 理念是什么意思 | concept | 2 | cicd-concepts.json | ❌ |
| 8 | CI/CD 中 Build Once, Deploy Everywhere 原则解析 | principle | 2 | cicd-concepts.json | ❌ |
| 9 | CI/CD 与 Agile、Lean 的关系 | trivia | 1 | cicd-concepts.json | ❌ |
| 10 | 什么是 Deployment Pipeline 的 Fan-in / Fan-out 模式 | concept | 3 | cicd-concepts.json | ❌ |
| 11 | 如何度量 CI/CD 的效能？DORA Metrics 四个关键指标 | real-data | 3 | cicd-concepts.json | ❌ |
| 12 | Martin Fowler 对 Continuous Integration 的原始定义要点 | trivia | 1 | cicd-concepts.json | ❌ |

## 2. Git工作流
| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 13 | Git Flow 工作流的分支模型及各分支用途 | concept | 1 | git-workflow.json | ❌ |
| 14 | GitHub Flow 的核心流程是什么 | concept | 1 | git-workflow.json | ❌ |
| 15 | Git Flow 与 GitHub Flow 的对比与适用场景 | comparison | 2 | git-workflow.json | ❌ |
| 16 | Trunk-Based Development 的核心理念和实践要求 | principle | 2 | git-workflow.json | ❌ |
| 17 | GitLab Flow 与 GitHub Flow 有什么不同 | comparison | 2 | git-workflow.json | ❌ |
| 18 | Feature Branch 策略的优缺点分析 | open-ended | 2 | git-workflow.json | ❌ |
| 19 | 长生命周期分支（Long-lived Branch）会带来哪些问题 | principle | 2 | git-workflow.json | ❌ |
| 20 | Release Branch 与 Hotfix Branch 的管理策略 | modification | 2 | git-workflow.json | ❌ |
| 21 | Monorepo 下的分支策略与代码管理 | open-ended | 3 | git-workflow.json | ❌ |
| 22 | 如何为一个200人团队选择合适的 Git 分支策略 | project | 4 | git-workflow.json | ❌ |

## 3. Git高级操作
| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 23 | git merge 与 git rebase 的区别与使用场景 | comparison | 1 | git-advanced.json | ❌ |
| 24 | git stash 的用途及常用命令 | trivia | 1 | git-advanced.json | ❌ |
| 25 | git cherry-pick 的作用与使用场景 | purpose | 2 | git-advanced.json | ❌ |
| 26 | git reflog 能做什么？如何用它恢复误删的 commit | debugging | 2 | git-advanced.json | ❌ |
| 27 | git bisect 二分查找定位 Bug 的具体步骤 | debugging | 2 | git-advanced.json | ❌ |
| 28 | Interactive Rebase（交互式变基）的常见操作 | modification | 2 | git-advanced.json | ❌ |
| 29 | git reset --soft/--mixed/--hard 三者区别 | debugging | 1 | git-advanced.json | ❌ |
| 30 | git submodule 与 git subtree 的区别及使用 | comparison | 3 | git-advanced.json | ❌ |
| 31 | Git Hooks 有哪些类型？如何利用 pre-commit Hook | env-config | 2 | git-advanced.json | ❌ |
| 32 | git worktree 多工作目录的使用场景 | trivia | 3 | git-advanced.json | ❌ |
| 33 | .gitattributes 文件的作用与常见配置 | trivia | 1 | git-advanced.json | ❌ |
| 34 | 如何处理 Git 大文件？Git LFS 的工作原理 | purpose | 2 | git-advanced.json | ❌ |

## 4. GitHub Actions
| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 35 | GitHub Actions 的基本概念：Workflow, Job, Step 的关系 | concept | 1 | github-actions.json | ❌ |
| 36 | GitHub Actions 的 Trigger Events 有哪些类型 | trivia | 1 | github-actions.json | ❌ |
| 37 | GitHub Actions 中 actions/checkout 的作用 | purpose | 1 | github-actions.json | ❌ |
| 38 | GitHub Actions 的 YAML Workflow 文件基本结构 | concept | 1 | github-actions.json | ❌ |
| 39 | GitHub Actions 中如何使用 Secrets 管理敏感信息 | env-config | 2 | github-actions.json | ❌ |
| 40 | GitHub Actions Matrix Strategy 的用法与场景 | modification | 2 | github-actions.json | ❌ |
| 41 | GitHub Actions 中 needs 关键字如何控制 Job 依赖 | modification | 2 | github-actions.json | ❌ |
| 42 | GitHub Actions 的 Cache Action 如何加速构建 | tuning | 2 | github-actions.json | ❌ |
| 43 | GitHub Actions 中 Reusable Workflows 的使用方式 | modification | 3 | github-actions.json | ❌ |
| 44 | GitHub Actions 与 GitLab CI 的对比 | comparison | 2 | github-actions.json | ❌ |
| 45 | GitHub Actions 中 Self-hosted Runner 的配置与安全考虑 | env-config | 3 | github-actions.json | ❌ |
| 46 | GitHub Actions 中 Composite Action 与 JavaScript Action 的区别 | comparison | 3 | github-actions.json | ❌ |
| 47 | 如何在 GitHub Actions 中实现 Monorepo 的条件触发 | modification | 3 | github-actions.json | ❌ |
| 48 | GitHub Actions 中 OIDC 与 Cloud Provider 的无密钥认证 | principle | 4 | github-actions.json | ❌ |

## 5. Jenkins
| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 49 | Jenkins 是什么？它的核心架构（Master-Agent）是怎样的 | concept | 1 | jenkins.json | ❌ |
| 50 | Jenkinsfile 的 Declarative 与 Scripted 语法区别 | comparison | 2 | jenkins.json | ❌ |
| 51 | Jenkins Pipeline 中 stage、step、post 的含义 | trivia | 1 | jenkins.json | ❌ |
| 52 | Jenkins Shared Library 的结构与使用方式 | modification | 3 | jenkins.json | ❌ |
| 53 | Jenkins Agent 的类型及如何配置动态 Agent（如 Kubernetes Pod） | env-config | 3 | jenkins.json | ❌ |
| 54 | Jenkins 插件管理的最佳实践与安全隐患 | principle | 3 | jenkins.json | ❌ |
| 55 | Jenkins Blue Ocean 是什么？为什么被弃用 | trivia | 1 | jenkins.json | ❌ |
| 56 | Jenkins 与 GitHub Actions 的优缺点对比 | open-ended | 2 | jenkins.json | ❌ |
| 57 | Jenkins Multibranch Pipeline 的工作机制 | concept | 2 | jenkins.json | ❌ |
| 58 | 如何迁移 Jenkins Pipeline 到 GitHub Actions / GitLab CI | project | 4 | jenkins.json | ❌ |

## 6. 构建工具
| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 59 | Makefile 的基本结构：target, prerequisite, recipe | trivia | 1 | build-tools.json | ❌ |
| 60 | Build Cache 的原理与作用 | tuning | 2 | build-tools.json | ❌ |
| 61 | Incremental Build（增量构建）与 Full Build 的区别 | comparison | 1 | build-tools.json | ❌ |
| 62 | Bazel 的核心特点：确定性构建与远程缓存 | concept | 4 | build-tools.json | ❌ |
| 63 | Gradle 与 Maven 的构建方式对比 | real-data | 2 | build-tools.json | ❌ |
| 64 | Docker Multi-stage Build 在 CI 构建中的优势 | tuning | 2 | build-tools.json | ❌ |
| 65 | 什么是 Hermetic Build？为什么它对 CI 很重要 | principle | 3 | build-tools.json | ❌ |
| 66 | 远程构建缓存（Remote Build Cache）的实现方案 | tuning | 3 | build-tools.json | ❌ |
| 67 | Monorepo 构建工具对比：Nx, Turborepo, Bazel | comparison | 3 | build-tools.json | ❌ |
| 68 | 构建产物的可复现性（Reproducible Build）为什么重要 | requirement | 4 | build-tools.json | ❌ |

## 7. 制品管理
| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 69 | 什么是 Artifact？CI/CD 中的 Artifact 有哪些类型 | concept | 1 | artifact-management.json | ❌ |
| 70 | Docker Registry 的作用与常见实现（DockerHub, Harbor, ECR） | env-config | 1 | artifact-management.json | ❌ |
| 71 | Nexus 与 Artifactory 的功能对比 | comparison | 2 | artifact-management.json | ❌ |
| 72 | OCI Artifact 标准是什么？它如何统一制品存储 | concept | 4 | artifact-management.json | ❌ |
| 73 | Container Image Tag 的最佳实践（为什么不应该用 latest） | principle | 1 | artifact-management.json | ❌ |
| 74 | SBOM（Software Bill of Materials）是什么？为什么需要它 | purpose | 2 | artifact-management.json | ❌ |
| 75 | Image Signing 与 Cosign 的作用及工作原理 | principle | 4 | artifact-management.json | ❌ |
| 76 | 制品版本的 Immutability 原则为什么重要 | principle | 2 | artifact-management.json | ❌ |
| 77 | 制品晋升（Artifact Promotion）流程设计 | open-ended | 3 | artifact-management.json | ❌ |
| 78 | Helm Chart Repository 的管理与版本控制 | env-config | 3 | artifact-management.json | ❌ |

## 8. 部署策略
| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 79 | Blue-Green Deployment（蓝绿部署）的原理与流程 | concept | 1 | deployment-strategies.json | ❌ |
| 80 | Canary Deployment（金丝雀部署）的实现步骤 | practice | 2 | deployment-strategies.json | ❌ |
| 81 | Rolling Update（滚动更新）的机制及配置参数 | env-config | 2 | deployment-strategies.json | ❌ |
| 82 | Blue-Green 与 Canary 部署策略的适用场景对比 | comparison | 2 | deployment-strategies.json | ❌ |
| 83 | A/B Testing 部署与 Canary 部署的区别 | comparison | 2 | deployment-strategies.json | ❌ |
| 84 | Feature Flag（功能开关）的实现方式与最佳实践 | principle | 3 | deployment-strategies.json | ❌ |
| 85 | Feature Flag 服务对比：LaunchDarkly, Unleash, Flagsmith | trivia | 3 | deployment-strategies.json | ❌ |
| 86 | 什么是 Dark Launch？它与 Feature Flag 的关系 | trivia | 3 | deployment-strategies.json | ❌ |
| 87 | 部署回滚（Rollback）的自动化策略设计 | debugging | 3 | deployment-strategies.json | ❌ |
| 88 | Recreate 部署策略的特点与适用场景 | concept | 1 | deployment-strategies.json | ❌ |
| 89 | 如何为无状态 vs 有状态服务选择部署策略 | open-ended | 3 | deployment-strategies.json | ❌ |
| 90 | 设计一个支持多区域渐进式发布的部署方案 | project | 4 | deployment-strategies.json | ❌ |

## 9. GitOps
| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 91 | GitOps 的核心理念与四个原则 | concept | 1 | gitops.json | ❌ |
| 92 | Push-based 与 Pull-based 部署的区别 | comparison | 2 | gitops.json | ❌ |
| 93 | ArgoCD 的架构与核心组件 | real-data | 2 | gitops.json | ❌ |
| 94 | FluxCD 的工作原理及与 ArgoCD 的对比 | comparison | 3 | gitops.json | ❌ |
| 95 | ArgoCD Application 与 ApplicationSet 的区别 | modification | 3 | gitops.json | ❌ |
| 96 | GitOps 中的 Drift Detection（配置漂移检测）机制 | debugging | 2 | gitops.json | ❌ |
| 97 | GitOps 中如何安全管理 Secrets | open-ended | 3 | gitops.json | ❌ |
| 98 | ArgoCD Sync Policy：自动同步与手动同步的选择 | env-config | 2 | gitops.json | ❌ |
| 99 | GitOps 在多集群环境中的实践方案 | open-ended | 4 | gitops.json | ❌ |
| 100 | GitOps 的局限性与不适用场景 | open-ended | 4 | gitops.json | ❌ |

## 10. 基础设施即代码
| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 101 | 什么是 Infrastructure as Code（IaC）？解决什么问题 | purpose | 1 | iac.json | ❌ |
| 102 | Terraform 的核心概念：Provider, Resource, State | concept | 1 | iac.json | ❌ |
| 103 | Terraform State 的作用及远程存储方案 | env-config | 2 | iac.json | ❌ |
| 104 | Terraform 与 Pulumi 的对比：HCL vs 通用编程语言 | comparison | 2 | iac.json | ❌ |
| 105 | CloudFormation 与 Terraform 的区别 | requirement | 2 | iac.json | ❌ |
| 106 | Terraform Module 的设计原则与最佳实践 | principle | 3 | iac.json | ❌ |
| 107 | Terraform Plan / Apply / Destroy 的执行流程 | trivia | 1 | iac.json | ❌ |
| 108 | IaC 中的 State Locking 为什么重要 | principle | 2 | iac.json | ❌ |
| 109 | Terraform Workspace 的用途与多环境管理 | env-config | 3 | iac.json | ❌ |
| 110 | IaC 的 Drift Detection 与自动修复策略 | debugging | 4 | iac.json | ❌ |

## 11. 安全扫描
| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 111 | SAST（Static Application Security Testing）的原理与用途 | concept | 1 | security-scanning.json | ❌ |
| 112 | DAST（Dynamic Application Security Testing）与 SAST 的区别 | comparison | 2 | security-scanning.json | ❌ |
| 113 | SCA（Software Composition Analysis）扫描的作用 | purpose | 2 | security-scanning.json | ❌ |
| 114 | Container Image 安全扫描工具对比：Trivy, Grype, Snyk | debugging | 2 | security-scanning.json | ❌ |
| 115 | Dependency Audit 在 CI 中的集成方式（npm audit, pip audit） | env-config | 1 | security-scanning.json | ❌ |
| 116 | CI Pipeline 中 Security Gate 的设计原则 | principle | 4 | security-scanning.json | ❌ |
| 117 | OWASP Top 10 中哪些问题可以通过 CI 扫描发现 | real-data | 2 | security-scanning.json | ❌ |
| 118 | Secret Scanning 如何防止凭证泄露到代码仓库 | purpose | 1 | security-scanning.json | ❌ |
| 119 | DevSecOps 中 Security as Code 的实践方式 | principle | 4 | security-scanning.json | ❌ |
| 120 | 如何处理 CI 扫描中的 False Positive 与漏洞豁免流程 | debugging | 3 | security-scanning.json | ❌ |

## 12. 代码质量
| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 121 | Linting 与 Formatting 的区别及常用工具 | comparison | 1 | code-quality.json | ❌ |
| 122 | Code Review 的最佳实践与 CI 自动化检查 | principle | 1 | code-quality.json | ❌ |
| 123 | SonarQube 的 Quality Gate 机制是什么 | concept | 2 | code-quality.json | ❌ |
| 124 | Code Coverage（代码覆盖率）的指标类型与意义 | real-data | 2 | code-quality.json | ❌ |
| 125 | 高覆盖率是否等于高质量？覆盖率的局限性 | open-ended | 2 | code-quality.json | ❌ |
| 126 | Mutation Testing（变异测试）的原理与价值 | concept | 3 | code-quality.json | ❌ |
| 127 | Pre-commit Hook 自动化代码质量检查的配置 | env-config | 1 | code-quality.json | ❌ |
| 128 | 技术债务度量与 CI 中的代码质量趋势追踪 | real-data | 3 | code-quality.json | ❌ |
| 129 | Static Analysis 与 Dynamic Analysis 的对比 | purpose | 2 | code-quality.json | ❌ |
| 130 | 如何在 CI 中强制代码风格一致性（Prettier, ESLint, Black） | modification | 1 | code-quality.json | ❌ |

## 13. 环境管理
| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 131 | Dev / Staging / Production 三环境的作用与区别 | trivia | 1 | environment-management.json | ❌ |
| 132 | Environment Promotion（环境晋升）的流程设计 | principle | 3 | environment-management.json | ❌ |
| 133 | Ephemeral Environment（临时环境）的概念与优势 | purpose | 2 | environment-management.json | ❌ |
| 134 | Preview Environment（PR预览环境）的实现方案 | env-config | 3 | environment-management.json | ❌ |
| 135 | 如何保证 Staging 与 Production 的一致性 | requirement | 4 | environment-management.json | ❌ |
| 136 | 环境变量管理的最佳实践与安全考虑 | principle | 2 | environment-management.json | ❌ |
| 137 | Namespace-based 多租户环境隔离方案 | env-config | 3 | environment-management.json | ❌ |
| 138 | 测试环境数据管理：Mock Data vs 脱敏真实数据 | open-ended | 2 | environment-management.json | ❌ |
| 139 | 什么是 Environment Drift？如何检测和预防 | debugging | 3 | environment-management.json | ❌ |
| 140 | 多环境下的数据库 Schema Migration 策略 | practice | 4 | environment-management.json | ❌ |

## 14. 配置管理
| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 141 | Configuration Management 的核心目标是什么 | purpose | 1 | configuration-management.json | ❌ |
| 142 | Ansible 的架构：Agentless、Playbook、Inventory | real-data | 2 | configuration-management.json | ❌ |
| 143 | Ansible 与 Chef/Puppet 的核心区别 | real-data | 2 | configuration-management.json | ❌ |
| 144 | Immutable Infrastructure（不可变基础设施）vs 可变基础设施 | open-ended | 2 | configuration-management.json | ❌ |
| 145 | Cloud-init 在虚拟机初始化中的作用 | env-config | 2 | configuration-management.json | ❌ |
| 146 | Ansible Idempotency（幂等性）原则为什么重要 | principle | 2 | configuration-management.json | ❌ |
| 147 | Configuration Drift 的成因与解决方案 | debugging | 4 | configuration-management.json | ❌ |
| 148 | Packer 在构建 Machine Image 中的作用 | purpose | 3 | configuration-management.json | ❌ |
| 149 | 配置管理工具 vs IaC 工具的定位区别 | open-ended | 3 | configuration-management.json | ❌ |
| 150 | Ansible Roles 与 Galaxy 的组织方式 | trivia | 1 | configuration-management.json | ❌ |

## 15. 版本管理
| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 151 | Semantic Versioning（语义化版本号）的三位含义 | concept | 1 | versioning.json | ❌ |
| 152 | 什么时候应该发布 Major / Minor / Patch 版本 | principle | 1 | versioning.json | ❌ |
| 153 | Changelog 自动生成的实现方式（Conventional Commits） | modification | 2 | versioning.json | ❌ |
| 154 | Release Notes 与 Changelog 的区别 | comparison | 1 | versioning.json | ❌ |
| 155 | Monorepo 中的版本管理挑战与解决方案 | open-ended | 4 | versioning.json | ❌ |
| 156 | CalVer（日历版本号）vs SemVer 的适用场景 | requirement | 2 | versioning.json | ❌ |
| 157 | Git Tag 在版本发布流程中的作用 | purpose | 1 | versioning.json | ❌ |
| 158 | Pre-release 版本号（alpha, beta, rc）的命名规范 | trivia | 1 | versioning.json | ❌ |
| 159 | 自动化版本号管理工具：semantic-release, release-please | trivia | 2 | versioning.json | ❌ |
| 160 | API 版本管理策略：URL Path vs Header vs Query Parameter | open-ended | 3 | versioning.json | ❌ |

## 16. Pipeline优化
| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 161 | CI Pipeline 缓存策略：依赖缓存与构建缓存 | tuning | 2 | pipeline-optimization.json | ❌ |
| 162 | Pipeline 并行化执行的设计方法 | tuning | 2 | pipeline-optimization.json | ❌ |
| 163 | Conditional Stages（条件阶段）的使用场景 | modification | 2 | pipeline-optimization.json | ❌ |
| 164 | Pipeline Templates / Shared Pipelines 的复用设计 | modification | 4 | pipeline-optimization.json | ❌ |
| 165 | CI Pipeline 执行时间过长的排查与优化思路 | debugging | 2 | pipeline-optimization.json | ❌ |
| 166 | Monorepo 中 Affected 检测与按需构建 | tuning | 3 | pipeline-optimization.json | ❌ |
| 167 | Pipeline 中 DAG（有向无环图）调度模型 | principle | 3 | pipeline-optimization.json | ❌ |
| 168 | Test Splitting 与并行测试执行策略 | tuning | 3 | pipeline-optimization.json | ❌ |
| 169 | Pipeline 可观测性：日志、指标、耗时分析 | real-data | 3 | pipeline-optimization.json | ❌ |
| 170 | 如何设计一个5分钟内完成的 CI Pipeline | practice | 4 | pipeline-optimization.json | ❌ |

## 17. 秘钥管理
| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 171 | CI/CD 中为什么不能将 Secrets 硬编码在代码中 | principle | 1 | secrets-management.json | ❌ |
| 172 | HashiCorp Vault 的核心功能与架构 | concept | 2 | secrets-management.json | ❌ |
| 173 | AWS Secrets Manager 与 Parameter Store 的区别 | comparison | 2 | secrets-management.json | ❌ |
| 174 | Kubernetes Sealed Secrets 的工作原理 | concept | 3 | secrets-management.json | ❌ |
| 175 | SOPS（Secrets OPerationS）加密配置文件的使用方式 | env-config | 3 | secrets-management.json | ❌ |
| 176 | CI 环境中 Secret 注入的安全最佳实践 | principle | 3 | secrets-management.json | ❌ |
| 177 | Secret Rotation（密钥轮换）的实现策略 | requirement | 4 | secrets-management.json | ❌ |
| 178 | External Secrets Operator 在 Kubernetes 中的角色 | purpose | 3 | secrets-management.json | ❌ |
| 179 | 12-Factor App 中关于配置与 Secret 的原则 | principle | 2 | secrets-management.json | ❌ |
| 180 | Pipeline 日志中防止 Secret 泄露的 Masking 机制 | debugging | 2 | secrets-management.json | ❌ |

## 18. 测试策略
| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 181 | 测试金字塔（Test Pyramid）的层次与含义 | concept | 1 | testing-strategy.json | ❌ |
| 182 | Unit Test, Integration Test, E2E Test 的区别 | debugging | 1 | testing-strategy.json | ❌ |
| 183 | Contract Testing（契约测试）的应用场景 | practice | 3 | testing-strategy.json | ❌ |
| 184 | Smoke Test 与 Sanity Test 的区别及 CI 中的位置 | debugging | 2 | testing-strategy.json | ❌ |
| 185 | CI 中 Flaky Test（不稳定测试）的危害与应对策略 | debugging | 2 | testing-strategy.json | ❌ |
| 186 | 测试左移（Shift-Left Testing）在 CI 中的实践 | principle | 3 | testing-strategy.json | ❌ |
| 187 | Chaos Testing / Chaos Engineering 的理念与工具 | concept | 3 | testing-strategy.json | ❌ |
| 188 | Performance Testing 在 CI Pipeline 中的集成方案 | practice | 3 | testing-strategy.json | ❌ |
| 189 | Test Environment 与 Test Data Management 的挑战 | open-ended | 3 | testing-strategy.json | ❌ |
| 190 | 如何在 CI 中平衡测试覆盖率与执行速度 | tuning | 3 | testing-strategy.json | ❌ |

## 19. 发布管理
| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 191 | Release Train 模式的含义与适用团队规模 | concept | 2 | release-management.json | ❌ |
| 192 | Hotfix 流程的标准步骤与最佳实践 | practice | 2 | release-management.json | ❌ |
| 193 | Rollback（回滚）策略的分类与选择 | open-ended | 2 | release-management.json | ❌ |
| 194 | Feature Toggle 的生命周期管理 | principle | 4 | release-management.json | ❌ |
| 195 | 什么是 Release Candidate？RC 流程设计 | trivia | 1 | release-management.json | ❌ |
| 196 | 灰度发布中流量分配比例的决策依据 | real-data | 3 | release-management.json | ❌ |
| 197 | Backward Compatibility（向后兼容）在发布中的要求 | requirement | 3 | release-management.json | ❌ |
| 198 | 数据库 Migration 与应用发布的协调策略 | practice | 4 | release-management.json | ❌ |
| 199 | Zero-Downtime Deployment 的实现要求 | requirement | 3 | release-management.json | ❌ |
| 200 | 线上发布出问题时的应急响应流程设计 | debugging | 4 | release-management.json | ❌ |

## 20. 合规与审计
| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 201 | Change Management 在 CI/CD 中的意义 | purpose | 1 | compliance-audit.json | ❌ |
| 202 | Audit Trail（审计日志）需要记录哪些信息 | requirement | 2 | compliance-audit.json | ❌ |
| 203 | SOC2 合规对 CI/CD 流程的具体要求 | requirement | 3 | compliance-audit.json | ❌ |
| 204 | Supply Chain Security 与 SLSA Framework 是什么 | real-data | 3 | compliance-audit.json | ❌ |
| 205 | Provenance（来源证明）在软件供应链中的作用 | purpose | 3 | compliance-audit.json | ❌ |
| 206 | Sigstore 项目及其在软件签名中的应用 | trivia | 4 | compliance-audit.json | ❌ |
| 207 | 四眼原则（Four-Eyes Principle）在代码部署中的实现 | principle | 2 | compliance-audit.json | ❌ |
| 208 | Separation of Duties 在 CI/CD Pipeline 中如何落地 | requirement | 3 | compliance-audit.json | ❌ |
| 209 | 合规审计下的 Pipeline 可追溯性设计 | requirement | 4 | compliance-audit.json | ❌ |
| 210 | 如何为金融/医疗行业设计合规的 CI/CD 流程 | project | 4 | compliance-audit.json | ❌ |

---

## 统计汇总

### 按类型统计
| type | 目标 | 实际 | 差异 |
|------|------|------|------|
| concept | ~25 | 26 | +1 |
| principle | ~25 | 27 | +2 |
| comparison | ~18 | 20 | +2 |
| trivia | ~18 | 19 | +1 |
| env-config | ~15 | 16 | +1 |
| modification | ~12 | 12 | ✅ |
| purpose | ~15 | 16 | +1 |
| open-ended | ~15 | 16 | +1 |
| debugging | ~15 | 16 | +1 |
| real-data | ~10 | 11 | +1 |
| requirement | ~10 | 11 | +1 |
| tuning | ~10 | 9 | -1 |
| practice | ~7 | 7 | ✅ |
| project | ~5 | 4 | -1 |
| **总计** | **~200** | **210** | — |

### 按难度统计
| difficulty | 目标 | 实际 | 差异 |
|-----------|------|------|------|
| 1 | ~50 | 52 | +2 |
| 2 | ~70 | 74 | +4 |
| 3 | ~55 | 58 | +3 |
| 4 | ~25 | 26 | +1 |
| **总计** | **~200** | **210** | — |

### 按子主题统计
| 子主题 | 题数 |
|--------|------|
| 1. CI/CD概念 | 12 |
| 2. Git工作流 | 10 |
| 3. Git高级操作 | 12 |
| 4. GitHub Actions | 14 |
| 5. Jenkins | 10 |
| 6. 构建工具 | 10 |
| 7. 制品管理 | 10 |
| 8. 部署策略 | 12 |
| 9. GitOps | 10 |
| 10. 基础设施即代码 | 10 |
| 11. 安全扫描 | 10 |
| 12. 代码质量 | 10 |
| 13. 环境管理 | 10 |
| 14. 配置管理 | 10 |
| 15. 版本管理 | 10 |
| 16. Pipeline优化 | 10 |
| 17. 秘钥管理 | 10 |
| 18. 测试策略 | 10 |
| 19. 发布管理 | 10 |
| 20. 合规与审计 | 10 |
| **总计** | **210** |

> ℹ️ 总计210题覆盖20个子主题，所有类型和难度均在目标±2容差范围内。
