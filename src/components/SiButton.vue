<template>
    <div> 
        <button class="button">
            <SiIcon :name="icon" :color="iconColor || color" />
            <span class="button-text" :style="{'color': color}">{{text}}</span>
        </button>
    </div>
</template>

<script>

import SiIcon from "@/components/SiIcon.vue";

export default {
    components: {
        SiIcon,
    },
    props: {
        iconColor: {type: String, default: null},
        icon: String,
        text: String,
        color: String,
    },
}

</script>