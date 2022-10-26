<h1 align="center">How to customize NGC for you needs?</h1>

To sum up, there is two possibilities to achieve this:

 1. To [fork](#fork) the `nosgestesclimat-site` repository. You will have **full control** of
    the content and modifications, however, you need to anticipate a
    **consequent amount of effort and development time to maintain it** --
    ~several weeks of web development.

2. To [integrate](#custom-iframe-integreation) the custom _iframe_. You will have **less control** but it should
   take **only ~15 minutes** for a tech-user to achieve thisl

## Fork

The code source of the website is open-source under the [MIT
license](https://github.com/datagir/nosgestesclimat-site/blob/master/LICENSE): you are free to reuse the
content of this repository as long as you credit the source.
For example you can add this paragraph on your home page:

> _"This version is freely based on the official version of Nos Gestes Climat
> developed by Datagir (ADEME) and ABC."_

 **Important, If you decide to fork the project, you need to remove any
 reference to the brand _Nos Gestes Climat_ as well as form contact and bug
 report targeting our domains.** Indeed, nosgestesclimat.fr is actively
 developed, we cannot afford that citizens have access to several
 desynchronized versions of the tool, both in terms of climate footprint model
 and user interface.

 **Unless explicitly agreed, the logos ADEME, ABC, Datagir, Nos Gestes Climat,
 must be removed by your care in your own version.**

## Custom iframe integration

The main advantage of this method is to avoid a regular maintenance as it
automatically receives updates from the platform, without any effort.
Moreover, this allows to keep the NGC brand.

To proceed, you simply need to add the snippet of code in your project:

```jsx
<script
    id="nosgestesclimat"
    src="https://nosgestesclimat.fr/iframe.js"
></script>
```

> You can check the [online demo](https://nosgestesclimat.fr/demo-iframe.html)
> and the corresponding [HTML
> page](https://github.com/datagir/nosgestesclimat-site/blob/master/dist/demo-iframe.html).

### Collect data from the simulation

By simply adding the parameter `data-share-data=true` to the HTML script, a
message will be displayed to the user when he/she arrives on the end of
simulation screen asking him/her if he/she wants to share his/her end of
simulation data (only the footprint of the main consumption categories will be
shared: food, transport etc.) to the website hosting the iframe.

On your side, here is [an
example](https://codesandbox.io/s/angry-rhodes-hu8ct?file=/src/ngc.js:251-267)
of how to use this feature. You will have to code (a little).

**Important, although we offer you this possibility, the responsibility of
data processing is entirely on your side. According to the RGPD law, you must
inform the user beforehand of the use that will be made of his data.**
