<template>
  <Clickable
    is="a"
    :href="pkgJson.repository"
    rel="noopener"
    target="_blank"
    class="flex items-center p-2 m-2px"
  >
    <Icon :icon="githubIcon.svg" class="fill-gray-100 mr-2" />

    Source code
  </Clickable>
</template>

<script lang="ts" setup>
import { siGithub as githubIcon } from "simple-icons/icons"

import pkgJson from "../../../package.json"
import Clickable from "../clickable.vue"

import Icon from "./icon.vue"
</script>
