'use strict';

const StoreModule = {
  namespaced: true,
  state: () => ({
    componentsData: {}
  }),
  getters: {
    getComponent: state => id => {
      return state.componentsData[id];
    }
  },
  actions: {
    setComponentData(context, {id, data}) {
      context.commit('setComponentData', {id, data});
    }
  },
  mutations: {
    setComponentData(state, {id, data}) {
      state.componentsData[id] = data;
    }
  }
};

const ChildMixin = {
  created() {
    let storedData = this.$store.getters['ssr/getComponent'](this.$options.__file);
    for (let key in storedData) {
      this[key] = storedData[key];
    }
  }
};

function getComponents(component) {
  let descendants = [];
  if (!component.components) {
    return descendants;
  }
  Object.keys(component.components).forEach((child) => {
    if (!component.components[child].__file) {
      return;
    }

    descendants.push(component.components[child]);
    let children = getComponents(component.components[child]);
    descendants = [...descendants, ...children];
  });

  return descendants;
}

const RootMixin = {
  async fetch(context) {
    let children = getComponents(this);

    let promises = children.map(async (component) => {
      if (component.asyncData && typeof component.asyncData === 'function') {
        let componentData = await component.asyncData(context);
        context.store.dispatch('ssr/setComponentData', {
          id: component.__file,
          data: componentData
        });
      }
    });

    await Promise.all(promises);
  },
};

module.exports = { StoreModule, ChildMixin, RootMixin };