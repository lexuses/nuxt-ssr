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
    let storedData = this.$store.getters['ssr/getComponent'](this.$options._scopeId);
    this._data = { ...this._data, ...storedData};
  }
};

function getComponents(component) {
  let descendants = [];
  if (!component.components) {
    return descendants;
  }
  Object.keys(component.components).forEach((child) => {
    if (!component.components[child]._scopeId) {
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
          id: component._scopeId,
          data: componentData
        });
      }
    });

    await Promise.all(promises);
  },
};

module.exports = { StoreModule, ChildMixin, RootMixin };