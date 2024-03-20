<template>
  <div>
    <editor
        :api-key="'zlsfl8mrv98mfeg0jmyckhx3pwagf392svpd77b0n999imuh'"
        :init="{
          height: 200,
          menubar: false,
          plugins: [
            'advlist autolink lists link anchor fullscreen insertdatetime paste code table wordcount',
          ],
          toolbar:
            'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat | link | code | fullscreen | table tabledelete | \
             tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | \
             tableinsertcolbefore tableinsertcolafter tabledeletecol',
        }"
        v-model="text"
      />
      {{ text }}
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'

export default {
  components: {
    Editor
  },
  data(){
    return {
      text : ''
    }
  }
}
</script>
