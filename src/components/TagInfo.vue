<template>
  <div v-if="tagData">
    <div class="tags-left-top">
      Study ID : {{ tagData.studyId }}<br>
      Study date : {{ tagData.studyDate }}<br>
      Patient's name : {{ tagData.patientName }}<br>
      Patient ID : {{ tagData.patientId }}<br>
      Patient sex : {{ tagData.patientSex }}<br>
      Patient's birth date : {{ tagData.patientBirthDate }}<br>
    </div>
    <div class="tags-right-top">
      Field strength : {{ tagData.fieldStrength }}<br>
      Scanning sequence : {{ tagData.scanningSequence }}<br>
      TR : {{ tagData.repetitionTime }}<br>
      TE : {{ tagData.echoTime }}<br>
      Flip angle : {{ tagData.flipAngle }}<br>
      Image dimensions (Y, Z, X) : <br>{{ tagData.imageDimensions }}<br>
      Voxel dimensions (Y, Z, X) : <br>{{ tagData.voxelDimensions }}<br>
    </div>
    <div class="tags-left-bottom">
      <div class="tags-left-bottom-inner"
           v-if="sliceNum">
        {{sliceNum}}/256
      </div>
    </div>
  </div>
</template>

<script>
  import * as busType from '@/util/bus/bus-types'
  import * as tagType from '@/data/tags'

  export default {
    name: 'TagInfo',
    props: {
      sliceNum: {
        type: Number,
        default: null
      }
    },
    data () {
      return {
        tagData: null
      }
    },
    created () {
      this.$bus.$on(busType.FILE_UPLOADED, this.dicomFileUploaded)
    },
    methods: {
      dicomFileUploaded (dicomFile) {
        switch (dicomFile.name) {
          case 'dicom-001-02.zip':
            this.tagData = tagType.TAG_001_02
            break
          case 'dicom-002-02.zip':
            this.tagData = tagType.TAG_002_02
            break
          case 'dicom-003-02.zip':
            this.tagData = tagType.TAG_003_02
            break
          case 'dicom-004-02.zip':
            this.tagData = tagType.TAG_004_02
            break
          case 'dicom-005-02.zip':
            this.tagData = tagType.TAG_005_02
            break
          default:
            break;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tags-left-top {
    position: absolute;
    left: 30px;
    top: 30px;
    width: 40%;
    height: 40%;
    text-align: left;
    color: #cfcfcf;
  }

  .tags-right-top {
    position: absolute;
    top: 30px;
    right: 30px;
    width: 50%;
    height: 40%;
    text-align: right;
    color: #cfcfcf;
  }

  .tags-left-bottom {
    position: absolute;
    left: 30px;
    bottom: 30px;
    width: 40%;
    height: 40%;
    text-align: left;
    color: #cfcfcf;

    .tags-left-bottom-inner {
      position: absolute;
      bottom: 0;
    }
  }
</style>
