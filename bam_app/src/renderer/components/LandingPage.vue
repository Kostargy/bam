<template>
  <div class="page-container md-layout-column">
    <md-toolbar class="md-primary">
      <md-button class="md-icon-button" @click="showNavigation = true">
        <md-icon>menu</md-icon>
      </md-button>
      <span class="md-title">{{ currenctProjectTitle }} - {{currenctProject.path}}</span>

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

    <md-content class='md-scrollbar'>
    <input type="file" @change="showFiles" webkitdirectory>
    <div class="md-layout">
      <div class="md-layout-item" v-click-outside="closeAbstractTextArea">
        <markdown-cheatsheet></markdown-cheatsheet>
        <p class="abstract-container" @click='editAbstract' v-show='!showAbstractTextArea'>
          <vue-markdown :source='getCurrenctAbstract()'>
          </vue-markdown>
        </p>
        <md-field v-show='showAbstractTextArea'>
          <md-textarea class="abstract-input" v-model="currenctAbstract" @keyup.enter="showAbstractTextArea = false"></md-textarea>
        </md-field>
      </div>
    </div>
    <div class="md-layout" v-click-outside='closeNextActionTextBox'>
      <div class="md-layout-item md-size-20" >
        <div class="md-layout">
          <div class="md-layout-item md-size-90">
            <md-checkbox v-model="nextAction.completed" v-show='!showNextActionTextBox'>{{nextAction.name}}</md-checkbox>
            <md-field v-show='showNextActionTextBox'>
              <label>Next Action</label>
              <md-input v-model="nextAction.name"  @keyup.enter="closeNextActionTextBox"></md-input>
            </md-field>
          </div>
        <div class="md-layout-item" @click='editNextAction'>
          <md-icon class="edit-action-icon">{{getNextActionIcon()}}</md-icon>
        </div>
        </div>
        <div class="md-layout">
          <div class="md-layout-item">
            <md-button class="md-raised" :disabled='!nextAction.completed'>Create Action</md-button>
          </div>
          <div class="md-layout-item">
            <md-button class="md-raised" @click="deleteLastAction">Delete Action</md-button>
          </div>
        </div>
      </div>
      <div class="md-layout-item" @click="showNewChildProjectDialog = true">
        <md-icon>library_add</md-icon>
        <md-tooltip md-direction="top">Make this action a project</md-tooltip>
        <md-dialog-prompt class='create-project-dialog'
          :md-active.sync="showNewChildProjectDialog"
          v-model="nextAction.name"
          md-title="Project Name"
          md-input-maxlength="40"
          md-input-placeholder="Type the project's name"
          md-confirm-text="Save"
          @md-confirm='createSubProject' />
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
  import VueMarkdown from 'vue-markdown';
  import MarkdownCheatsheet from './MarkdownCheatsheet';
  import fs from 'fs';
  import io from './io';
  //const fs = require('fs');

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
    components: { TreeView, VueMarkdown, MarkdownCheatsheet },
    data() {
      return {
        dir_path: null,
        dirs: [

        ],
        showNavigation: false,
        showSidepanel: false,
        currenctAbstract: 'foo bar',
        showAbstractTextArea: false,
        showNextActionTextBox: true,
        showNewChildProjectDialog: false,
        nextAction: {
          name: null,
          completed: false,
          date: null
        },
      }
    },
    methods: {
      showFiles(e) {
        let path = e.target.files[0].path;
        this.dir_path = path;
        this.updateFiles(path);
      },
      updateFiles(path){
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
        if(this.showNextActionTextBox){
          this.closeNextActionTextBox()
        }else{
          this.showNextActionTextBox = !this.showNextActionTextBox;
        }
      },
      closeNextActionTextBox () {
        if(this.nextAction.length < 1){
          return;
        }
        this.showNextActionTextBox = false;
        //write next action to file here
      },
      getCurrenctAbstract() {
        // if the abstract for a project is empty show the text area
        if(this.currenctAbstract.length < 1){
          this.showAbstractTextArea = true;
        }
        return this.currenctAbstract;
      },
      getNextActionIcon() {
        if(this.showNextActionTextBox){
          return 'done';
        }else{
          return 'edit';
        }
      },
      deleteLastAction() {
        this.removeLastAction();
      },
      removeLastAction(path){
        let actions_file_path = null;
        if(!path){
          //remove action from project/subproject root
          actions_file_path = this.currenctProject.path + '/actions.act';
        }else{
          actions_file_path = path;
        }
        if(!actions_file_path){
          return;
        }
        fs.readFile(actions_file_path, 'utf8', function(err, data){
            let splitArray = data.split('\n');
            splitArray.pop();
            let result = splitArray.join('\n');
            fs.writeFile(actions_file_path, result);
        });
        this.resetNextActionField();
      },
      resetNextActionField(){
        this.nextAction.name = null;
        this.nextAction.completed = false;
        this.nextAction.date = null;
        this.showNextActionTextBox = true;
        return true;
      },
      createSubProject(value) {
        this.createProject(value);
        this.updateFiles(this.dir_path);
        // delete last action and show the last completed action
        let actions_file_path = this.currenctProject.path + '/actions.act';
        this.removeLastAction(path);
        this.fetchLastAction(path);
      },
      createProject(name) {
        let self = this;
        let sub_project_root = this.currenctProject.path+ '/'+name;
        let attachments_dir = sub_project_root+'/attachments';
        this.ensureExists( sub_project_root, function(err) {
            if (err) console.log('error');
            else console.log('folder created');
            self.ensureExists(attachments_dir, function(err) {
                if (err) console.log('error');
                else console.log('attachments dir created');
                fs.closeSync(fs.openSync(sub_project_root+'/abstract.md', 'a'));
                fs.closeSync(fs.openSync(sub_project_root+'/actions.act', 'a'));
                fs.closeSync(fs.openSync(attachments_dir+'/links.txt', 'a'));
            });
            if(name.includes('brainstorming')){
              return;
            }else{
              self.createSubProject(name+'/brainstorming');
            }
        });
      },
      ensureExists(path, mask, cb) {
          if (typeof mask == 'function') { // allow the `mask` parameter to be optional
              cb = mask;
              mask = '0777';
          }
          fs.mkdir(path, mask, function(err) {
              if (err) {
                  if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
                  else cb(err); // something else went wrong
              } else cb(null); // successfully created folder
          });
      },
      fetchLastAction(path) {
        let self = this;
        let actions = io.readActionsFile(path);
        console.log(actions);
        
        if(actions && actions.length>0){
          let last_action = actions.pop();
          if(last_action.name && last_action.date){
            console.log(last_action);

            self.nextAction = last_action;
          }
        }else{
          self.resetNextActionField();
        }
      },
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
            self.fetchLastAction(actions_file_path);
          }
        },
        nextAction(oldValue, newValue) {
          if(newValue.name == null && newValue.date == null){
            this.showNextActionTextBox = true;
          }else{
            // write next action to file
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
    /*overflow: hidden;*/
    border: 1px solid rgba(#000, .12);
  }

  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  .md-content {
    padding: 16px;
    overflow: auto !important;
  }

  .abstract-container {
    margin-top: 20px;
  }

  .abstract-container:hover{
    cursor: pointer;
  }

  .abstract-input {
    min-height: 500px !important;
  }
  .edit-action-icon{
    position: relative;
    top: calc(50% - 12px);
  }
  .edit-action-icon:hover{
    cursor: pointer;
  }

  .create-project-dialog{
    width: 400px;
  }
</style>
