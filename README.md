
# New way of doing Nuxt.js with nuxt-ssr

Nuxt.js is a popular framework build on top of Vue. 



## What is nuxt-ssr

[Nuxt-ssr](https://github.com/lexuses/nuxt-ssr) is a nuxt.js module which allows you to get access to a build-in AsyncData method from child components.

So, why is it worth considering using a **nuxt-ssr** in your next project?



### 1. Helps to make code more clear and readable

Nuxt approach to server side data rendering is great, but things can get a little bit complicated when you are building a complex application with deeply nested components. Each time you need to pass some data  to a new component, somewhere down your component tree you have to use a props chain and pass the data all the way from top to bottom.

The better solution is to allow such a component to have an access to parent's asyncData method and fetch an exact data it needs.

### 2. Allows each component to handle it's own state

You can easily implement all data and errors handling methods inside a child component. 



## How to use

### Install 

```
npm i nuxt-ssr --save
```

or

```
yarn add nuxt-ssr
```

### Setup

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


## To sum it all up

Nuxt-ssr provides you with an easy way of handling your data inside of child components instead of using a props chain. 
