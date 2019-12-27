<template>
  <div class="page-container md-layout-column">
    <md-toolbar class="md-primary">
      <md-button class="md-icon-button" @click="showNavigation = true">
        <md-icon>menu</md-icon>
      </md-button>
      <span class="md-title">{{ currenctProjectTitle }}</span>

      <div class="md-toolbar-section-end">
        <md-button @click="showSidepanel = true">Attachments</md-button>
      </div>
    </md-toolbar>

    <md-drawer :md-active.sync="showNavigation" md-swipeable>
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title">B.A.M. Protocol</span>
      </md-toolbar>
      <md-list>
        <tree-view
        v-for='sub_dir in dirs'
        :key='sub_dir.path'
        :dir='sub_dir'
        :depth='0'
        ></tree-view>
      </md-list>
    </md-drawer>

    <md-drawer class="md-right" :md-active.sync="showSidepanel">
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title">Favorites</span>
      </md-toolbar>

      <md-list>
        <md-list-item>
          <span class="md-list-item-text">Abbey Christansen</span>

          <md-button class="md-icon-button md-list-action">
            <md-icon class="md-primary">chat_bubble</md-icon>
          </md-button>
        </md-list-item>

        <md-list-item>
          <span class="md-list-item-text">Alex Nelson</span>

          <md-button class="md-icon-button md-list-action">
            <md-icon class="md-primary">chat_bubble</md-icon>
          </md-button>
        </md-list-item>

        <md-list-item>
          <span class="md-list-item-text">Mary Johnson</span>

          <md-button class="md-icon-button md-list-action">
            <md-icon>chat_bubble</md-icon>
          </md-button>
        </md-list-item>
      </md-list>
    </md-drawer>

    <md-content>
    <input type="file" @change="showFiles" webkitdirectory>
    <div class="md-layout">
      <div class="md-layout-item" v-click-outside="closeAbstractTextArea">
        <p class="abstract-container" @click='editAbstract' v-show='!showAbstractTextArea'>
          {{ getCurrenctAbstract() }}
        </p>
        <md-field v-show='showAbstractTextArea'>
          <md-textarea v-model="currenctAbstract" @keyup.enter="showAbstractTextArea = false"></md-textarea>
        </md-field>
      </div>
    </div>
    <div class="md-layout" v-click-outside='closeNextActionTextBox'>
      <div class="md-layout-item" >
        <div class="md-layout">
          <div class="md-layout-item">
            <md-checkbox v-model="nextActionCheckbox" v-show='!showNextActionTextBox'>{{nextAction}}</md-checkbox>
            <md-field v-show='showNextActionTextBox'>
              <label>Next Action</label>
              <md-input v-model="nextAction"  @keyup.enter="showNextActionTextBox = false"></md-input>
            </md-field>
          </div>
        </div>
        <div class="md-layout">
          <div class="md-layout-item">
            <md-button class="md-raised" :disabled='!nextActionCheckbox'>Create Action</md-button>
          </div>
          <div class="md-layout-item">
            <md-button class="md-raised">Delete Action</md-button>
          </div>
        </div>
      </div>
      <div class="md-layout-item" @click='editNextAction'>
        <md-icon >edit</md-icon>
      </div>
      <div class="md-layout-item">
        <md-icon>library_add</md-icon>
        <md-tooltip md-direction="top">Make this action a project</md-tooltip>
      </div>
    </div>
    </md-content>
  </div>
</template>

<script>
  import { log } from 'util';
  import dirTree from 'directory-tree';
  import TreeView from './TreeView';
  import { mapState } from 'vuex';
  import Vue from 'vue';

  const fs = require('fs');

Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    window.event = function (event) {
      if (!(el == event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', window.event)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', window.event)
  },
});

  export default {
    name: 'landing-page',
    components: { TreeView },
    data() {
      return {
        dir_path: null,
        dirs: [

        ],
        showNavigation: false,
        showSidepanel: false,
        currenctAbstract: 'foo bar',
        showAbstractTextArea: false,
        showNextActionTextBox: false,
        nextActionCheckbox: false,
        nextAction: 'Test Action',
      }
    },
    methods: {
      showFiles(e) {
        let path = e.target.files[0].path;
        console.log(path);
        let tree = dirTree(path);
        console.log(tree);
        this.dirs = [tree];
        // fs.readdirSync(path).forEach(file => {
        //   console.log(file);
        // });
        return true;
      },
      editAbstract() {
        this.showAbstractTextArea = true;
      },
      closeAbstractTextArea() {
        this.showAbstractTextArea = false;
      },
      editNextAction() {
        console.log('hey');
        
        this.showNextActionTextBox = true;
      },
      closeNextActionTextBox () {
        this.showNextActionTextBox = false;
      },
      getCurrenctAbstract() {
        if(this.currenctAbstract.length < 1){
          this.showAbstractTextArea = true;
        }
        return this.currenctAbstract;
      }
    },
    computed: mapState({
        currenctProjectTitle: function(state){
          if(state.ActiveProject.project){
            return state.ActiveProject.project.name;
          }
          return 'No Project Selected';
        },
        currenctProject: function(state){
          return state.ActiveProject.project;
        }
      }),
      watch: {
        currenctProject(newProject, oldProject) {
          let abstract_file_path = '';
          let actions_file_path = '';
          let self = this;
          let abstract_txt = 'No Abstract';
          let action_txt = 'No action';
          if (newProject) {
            abstract_file_path = newProject.path + '/abstract.md';
            actions_file_path = newProject.path + '/actions.act';
            fs.readFile(abstract_file_path, function(err,data)
            {
                if(!err){
                  abstract_txt = data.toString();
                }
                self.currenctAbstract = abstract_txt;

            });
            fs.readFile(actions_file_path, function(err,data)
            {
                if(!err){
                  try {
                    action_txt = data.toString().split('\n');
                  } catch (error) {
                    self.nextAction = null;
                    self.showNextActionTextBox = true;
                    return;
                  }
                }
                if (action_txt.length <= 1 || action_txt == 'No action') {
                  self.showNextActionTextBox = true;
                  self.nextAction = null;
                  return;
                }
                console.log(action_txt.length);
                let next_action = action_txt[action_txt.length-1];
                if(next_action == ''){
                  next_action = action_txt[action_txt.length-2];
                }
                let next_action_checkbox = next_action.split(']')[0];
                if(next_action_checkbox.length >= 2){
                  self.nextActionCheckbox = true;
                }else{
                  self.nextActionCheckbox = false;
                }

                self.nextAction = next_action.substring(
                    next_action.lastIndexOf("]") + 1,
                    next_action.lastIndexOf("//")
                );
                //self.currenctAbstract = abstract_txt;

            });
          }
        },
        showAbstractTextArea(oldValue, newValue){
          // that means that the text area was closed thus needs to be saved into file
          if(oldValue == false && newValue == true){
            let abstract_file_path = this.currenctProject.path + '/abstract.md';
            fs.writeFile(abstract_file_path, this.currenctAbstract, (err) => {
              if (err) throw err;
              console.log('The file has been saved!');
            });
          }
        }
      },

  }
</script>

<style>

  .page-container {
    overflow: hidden;
    border: 1px solid rgba(#000, .12);
  }

  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  .md-content {
    padding: 16px;
  }

  .abstract-container {
    margin-top: 20px;
  }

  .abstract-container:hover{
    cursor: pointer;
  }

</style>
