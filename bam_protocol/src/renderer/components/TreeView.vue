<template>
<md-list-item :md-expand='hasChildren()' :style='indent' class='node' @click.stop='chooseProject'>
    <md-icon>{{ getIcon(dir.type) }}</md-icon>
    <span class="md-list-item-text">{{ dir.name }}</span>

    <md-list slot="md-expand" v-show='getSubProjects.length > 0'>
        <tree-view
        v-for='sub_dir in getSubProjects'
        :key='sub_dir.path'
        :dir='sub_dir'
        :depth='depth + 1'
        ></tree-view>
    </md-list>

</md-list-item>
</template>

<script>
export default {
    name: 'tree-view',
    props: ['dir', 'depth'],
    data (){
        return {

        }
    },
    methods: {
        hasChildren() {
            if(this.dir.children){
                return true;
            }
            return false;
        },
        getIcon(type) {
            if(type == 'directory'){
                return 'folder';
            }else if(type == 'file'){
                return 'menu_book';
            }
        },
        chooseProject(){
            this.$store.dispatch('setProject', this.dir);
        }
    },
    computed: {
        indent() {
            return { 'padding-left': `${this.depth * 50}px` }
        },
        getSubProjects() {
            let array = [];
            for (let i = 0; i < this.dir.children.length; i++) {
                const element = this.dir.children[i];
                if (element.type == 'directory' && element.name != 'attachments') {
                    array.push(element);
                }
            }
            return array;
        }
    }
}
</script>

<style>
.node:hover {
    cursor: pointer;
}
</style>