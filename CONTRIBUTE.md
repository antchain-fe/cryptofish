Note for beta developers:
1. pull myfish repo and run(cd myfish && tnpm run watch)
2. link packages to global:
   * cd myfish/packages/myfish && tnpm link
   * cd myfish/packages/myassembly && tnpm link
   * cd myfish/packages/asp-config && tnpm link
3. install deps for current project(tnpm i)
4. link myfish packages
   * tnpm link @antchain/myfish
   * tnpm link @antchain/myassembly
   * tnpm link @antchain/myfish-asp-config
5. download `myvm` and make it work in your PATH env
6. compile(tnpm run compile) and deploy to local `myvm`(tnpm run deploy:local)
7. unit tests(tnpm run test)

仅开发者可以调用：
* `onContractDeploy(): void` 模拟「合约部署」回调，只可以调用一次（记录合约部署者地址）
* `setCanMint(canMint: u32): void` 设置是否可以继续铸造
* `pickLogoByScore(): bool` 根据 cryptofish 分数来自动选择（越高）出 Logo

用户可以调用：
* `mint(): bool` 铸造方法，有一些限制
* `getLogo(): string` 查询 Logo（如未选出则报错）
* `favorByIndex(index: u32): bool` 根据序号给 cryptofish 点赞（喜欢）
* `favorByAttribute(attribute: string): bool` 根据特征给 cryptofish 点赞（喜欢）
* `getCollectionByIndex(index: u32): string` 根据序号查询 cryptofish
* `getCollectionByAttribute(attribute: string): string` 根据特征查询 cryptofish
* `getOwnedCollections(): string` 查询自己拥有的 cryptofish
* `getCollectionCount(): u32` 查询已铸造 cryptofish 的数量
* `getCollections(limit: u32, skip: u32): string` 列出 cryptofish（带分页）
