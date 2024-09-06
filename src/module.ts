import { createResolver, addComponent, addImportsSources, useNuxt, defineNuxtModule, addPluginTemplate } from '@nuxt/kit';
import * as AllComponents from 'janus-ui';
// import * as AllIcons from '@janus-c/icons-vue';

function resolvePath(path) {
  const { resolvePath: resolvePath2 } = createResolver(import.meta.url);
  return resolvePath2(path);
}
function hyphenate(value) {
  return value.replace(/\B([A-Z])/g, "-$1").toLowerCase();
}

const libraryName = "janus-ui";
// const iconLibraryName = "@janus-c/icons-vue";

// const allIcons = Object.keys(AllIcons);
const allSubComponents = {
  JaAnchor: ["JaAnchorLink"],
};


function resolveComponent () {
  // 子组件的map
  const subComponentsMap = Object.fromEntries(
    Object.entries(allSubComponents).reduce((all, [key, values]) => {
      values.forEach((item) => {
        all.push([item, key]);
      });
      return all;
    }, [])
  );
  Object.entries(AllComponents).forEach(async ([key, item]: any) => {
    const regExp = /^Ja[A-Z]\w+/;
    if (regExp.test(key)) {
      const componentName = subComponentsMap[key] || key;
      const dir = hyphenate(componentName.slice(2));
      addComponent({
        name: key,
        export: key,
        filePath: await resolvePath(`${libraryName}/es/components/${dir}/index.mjs`),
      })
    }
    
  })
}

function resolveThemes() {
  const nuxt = useNuxt();
  nuxt.options.css.push(`${libraryName}/theme-chalk/index.css`);
}

const module = defineNuxtModule({
  meta: {
    name: libraryName,
    configKey: "janusUI",
    compatibility: {
      nuxt: ">=3"
    }
  },
  async setup(_options, nuxt) {
    resolveThemes()
    resolveComponent()
    
  }
});

export default module