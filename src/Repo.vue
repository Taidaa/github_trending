<script>
    export default {
        props: ['repo']
    }
</script>

<template>
    <div data-url="#" class="post">
        <div class="name">{{repo.name}}</div>
        <div class="description">{{ repo.description }}</div>
        <div class="stars">{{ repo.stars }}</div>
    </div>
</template>

<style scoped>
    .post {
        font-size: 1.3em;
        padding: 3px 1em;
        width: 90%;
        border: solid #161b22 4px;
        border-radius: 6px;
        font-family: Calibri, 'Trebuchet MS', sans-serif;
        cursor: pointer;
        transition: .3s;
    }

    .post:hover, .post:hover div{
        transition: .2s;
        background: #161b22;
        color: white;
        box-shadow: #161b22 0 0 10px;
    }

    .post:hover .stars::before {
        color: rgb(202, 176, 28);
    }

    .name {
        font-weight: bold;
        font-size:1.3em;
        color: #161b22;
        text-shadow: #f6f6f648 0 0 6px;
    }

    .description {
        color: #52555a
    }

    .stars {
        color: rgba(69, 100, 202, 0.678);
    }
    .stars::before{
        content: '☆';
        text-shadow: #161b226e 0 0 3px;
        font-weight: bold;
        position: relative;
        left: -2px;
    }
</style>