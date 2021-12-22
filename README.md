# cryptofish
Collectible crypto-fish on mychain, powered by myfish.

> Note for beta developers:
> 1. pull myfish repo and run(cd myfish && tnpm run watch)
> 2. link packages to global:
>    * cd myfish/packages/myfish && tnpm link
>    * cd myfish/packages/myassembly && tnpm link
>    * cd myfish/packages/asp-config && tnpm link
> 3. install deps for current project(tnpm i)
> 4. link myfish packages
>    * tnpm link @antchain/myfish
>    * tnpm link @antchain/myassembly
>    * tnpm link @antchain/myfish-asp-config
> 5. download `myvm` and make it work in your PATH env
> 6. compile(tnpm run compile) and deploy to local `myvm`(tnpm run deploy:local)
> 7. unit tests(tnpm run test)
