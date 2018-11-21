## Description
**Nuxt-ssr** allows you to fetch data and render it on the server-side directly from a child component by using a build-in nuxt asyncData method.

## Install
```
npm i nuxt-ssr --save
```
OR
```
yarn add nuxt-ssr
```

## Setup
1. Include module in store as **ssr** namespace
    ```javascript
    import Vuex from 'vuex'
    import {StoreModule} from 'nuxt-ssr'
    
    const store = () => {
      return new Vuex.Store({
        modules: {
          ssr: StoreModule
        }
      })
    };
    
    export default store
    ```

2. Link the RootMixin with components from the **pages** folder
    ```javascript
    import {RootMixin} from 'nuxt-ssr'
    import ChildComponent from '~/components/ChildComponent';
    
    export default {
      mixins: [RootMixin],
      components: {ChildComponent},
    }
    ```

3. Link the ChildMixin with components from the **components** folder which you want to be loaded on the server side.
    ```javascript
    import {ChildMixin} from 'nuxt-ssr'
    
    export default {
      mixins: [ChildMixin],
      data() {
        return {
          post: {}
        }
      },
      async asyncData({ app }) {
        let post = await getPostFromSomewhere();
        return { post };
      },
    }
    ``` 
    
    You can still use **context** in the asyncData function. (https://nuxtjs.org/api/context/)
    The "created" hook would replace the data on the client side.