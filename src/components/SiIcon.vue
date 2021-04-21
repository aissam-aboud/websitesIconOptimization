<template>
    <div>
        <span :class="`icon icon-${name}`" :style="style"></span>
    </div>
</template>

<script>

import filter from '../assets/js/filter'

export default {
    props: {
        color: String,
        name: String,
    },
    created(){
        this.style = filter.getNewColor(this.color);
    },
};

</script>