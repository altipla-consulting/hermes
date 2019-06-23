
export default {
  name: 'router-view',
  functional: true,

  render(createElement, {parent}) {
    // Directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    const h = parent.$createElement;

    // Render view component if present. If there is a loading component we use
    // it as a child even when it isn't be visible. This should allow
    // Vue to mount the element and start the load process.
    let children = [];
    if (parent.$route.component) {
      children.push(h(parent.$route.component, {viewComponent: true}));
    }
    if (parent.$router.$$loadingComponent) {
      children.push(h(parent.$router.$$loadingComponent, {
        viewComponent: true,
        style: {
          visibility: 'hidden',
        },
      }));
    }
    return h('main', null, children);
  },
};
