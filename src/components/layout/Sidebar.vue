<template>
  <aside class="menu app-sidebar">

    <ul class="menu-list">
      <li v-for="(menu, index) in menus">

        <a v-if="menu.children && menu.children.length" :aria-expanded="isExpanded(menu)" @click="toggle(index, menu)">
          <!--<img src="/static/logo.png" style="width: 25px; height: 25px; top: 0; left: 0;">-->
          <img v-if="menu.meta.icon" :src="`/static/sample/imgs/${menu.meta.icon}`" style="width: 24px; height: 24px; top: 0; left: 0;">
          &nbsp;{{ menu.meta.label }}
          <span class="icon is-small is-angle" v-if="menu.children && menu.children.length">
            <icon name="angle-down"></icon>
          </span>
        </a>
        <a v-else
           :class="{ active: currentMenu.name == menu.name }"
           @click="menuClicked(menu)">
          <img v-if="menu.meta.icon" :src="`/static/sample/imgs/${menu.meta.icon}`" style="width: 24px; height: 24px; top: 0; left: 0;">
          &nbsp;{{ menu.meta.label }}
        </a>

        <expanding v-if="menu.children && menu.children.length">
          <ul v-show="isExpanded(menu)">
            <li v-for="subMenu in menu.children">
              <a
                v-if="menu.type === 'layout'"
                :class="{ active: currentLayout == subMenu.name }"
                @click="menuClicked(subMenu)">
                <img v-if="subMenu.meta.icon" :src="`/static/sample/imgs/${subMenu.meta.icon}`"
                     style="width: 24px; height: 24px; top: 0; left: 0;">
                &nbsp;<span>{{ subMenu.meta.label }}</span>
              </a>
              <a
                v-else
                :class="{ active: currentMenu.name == subMenu.name }"
                @click="menuClicked(subMenu)">
                <img v-if="subMenu.meta.icon" :src="`/static/sample/imgs/${subMenu.meta.icon}`"
                     style="width: 24px; height: 24px; top: 0; left: 0;">
                &nbsp;<span>{{ subMenu.meta.label }}</span>
              </a>
            </li>
          </ul>
        </expanding>

      </li>
    </ul>
  </aside>
</template>

<script>
  import {mapGetters, mapState, mapActions} from 'vuex'
  import * as busType from '@/util/bus/bus-types'

  import Expanding from 'vue-bulma-expanding'

  export default {
    name: 'Sidebar',
    components: {
      Expanding
    },
    computed: {
      ...mapGetters({
        menus: 'menus'
      }),
      ...mapState({
        currentLayout: 'currentLayout',
        currentMenu: 'currentMenu'
      })
    },
    methods: {
      ...mapActions([
        'expandMenu'
      ]),
      isExpanded (menu) {
        return menu.meta.expanded
      },
      toggle (index, menu) {
        this.expandMenu({
          index: index,
          expanded: !menu.meta.expanded
        })
      },
      menuClicked (menu) {
        this.$bus.$emit(busType.MENU_CLICKED, menu)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../style/bh_style.scss";

  .app-sidebar {
    position: fixed;
    top: $header-height;
    left: 0;
    bottom: 0;
    padding: 0 0 50px;
    width: $sidebar-width;
    height: 100%;
    z-index: 1025;
    background-color: $sidebar-menu-bg-color;
    overflow-y: auto;

    .icon {
      vertical-align: baseline;
      &.is-angle {
        position: absolute;
        right: 10px;
        transition: transform .3s ease;
      }
    }

    .menu-list {
      a {
        margin: 3px;
        &:hover {
          background-color: $sidebar-menu-over-bg-color;
          color: $sidebar-menu-over-label-color;
        }
        &:active {
          background-color: $sidebar-menu-press-bg-color;
          color: $sidebar-menu-press-label-color;
        }
        /*&:focus {*/
          /*color: white;*/
          /*background-color: midnightblue;*/
        /*}*/
      }

      li a {
        &[aria-expanded="true"] {
          .is-angle {
            transform: rotate(180deg);
          }
        }
        color: $sidebar-menu-label-color;
      }

      li a.active {
        background-color: $sidebar-menu-select-bg-color;
        color: $sidebar-menu-select-label-color;
      }

      aside ul {
        background-color: #232228;
      }

      li ul {
        margin: 0 0 0 25px;
        border-left-color: #d8d8d8;
        background-color: #16151a;
      }
    }
  }
</style>
