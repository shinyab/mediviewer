<template>
  <aside class="menu app-sidebar">

    <ul class="menu-list">
      <li v-for="(menu, index) in menus">

        <a v-if="menu.children && menu.children.length" :aria-expanded="isExpanded(menu)" @click="toggle(index, menu)">
          <!--<img src="/static/logo.png" style="width: 25px; height: 25px; top: 0; left: 0;">-->
          {{ menu.meta.label }}
          <span class="icon is-small is-angle" v-if="menu.children && menu.children.length">
            <icon name="caret-down"></icon>
          </span>
        </a>
        <a v-else
           :class="{ active: currentMenu.name == menu.name }"
           @click="menuClicked(menu)">
          <span>{{ menu.meta.label }}</span>
        </a>

        <expanding v-if="menu.children && menu.children.length">
          <ul v-show="isExpanded(menu)">

            <template v-if="menu.type === 'layout'">
              <li v-for="subMenu in menu.children">
                <a
                  :class="{ active: currentLayout == subMenu.name }"
                  @click="menuClicked(subMenu)">
                  <span>{{ subMenu.meta.label }}</span>
                </a>
              </li>
            </template>
            <template v-else>
              <li v-for="subMenu in menu.children">
                <a
                  :class="{ active: currentMenu.name == subMenu.name }"
                  @click="menuClicked(subMenu)">
                  <span>{{ subMenu.meta.label }}</span>
                </a>
              </li>
            </template>

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
    top: 52px;
    left: 0;
    botton: 0;
    padding: 0;
    width: 250px;
    height: 100vh;
    z-index: 1025;
    background-color: $sidebar-bg-color;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
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
      li a {
        &[aria-expanded="true"] {
          .is-angle {
            transform: rotate(180deg);
          }
        }
        color: $sidebar-label-color;
      }

      li a.active {
        color: white;
        background-color: midnightblue;
      }

      li ul {
        margin: 0 0 0 -13px;
      }
    }
  }
</style>
