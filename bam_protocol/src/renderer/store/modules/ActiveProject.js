const state = {
    project: {
      children: [],
      name: 'No Project Selected'
    }
  }
  
  const mutations = {
    setProject (state, project) {
      state.project = project;
    }
  }
  
  const actions = {
    setProject(store, project) {
      store.commit('setProject', project);

    }
  }
  
  export default {
    state,
    mutations,
    actions
  }