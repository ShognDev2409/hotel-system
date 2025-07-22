<template>
    <div>
{{name}}
    </div>
</template>

<script>
    export default {
        data() {
            return {
                name:"andy1"
            }
        },
        mounted() {
          
            this.print();
        },
        methods: {
            print(){
                console.log(this.name);
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>