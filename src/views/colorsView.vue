<template>
    <div>
        <SiButton text="buy now" color="#b537c5" iconColor="#b537c5" icon="clock" />
        <SiButton text="calendar" color="#ff0000" iconColor="#ff0000" icon="calendar" />
        <SiButton text="contact" color="#0000FF" iconColor="#0000FF" icon="person" />
    </div>
</template>

<script>

import SiButton from "@/components/SiButton.vue";

export default {
    components: {
        SiButton,
    },
}

</script>
