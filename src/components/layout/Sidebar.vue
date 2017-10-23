<template>
  <aside class="menu app-sidebar">
    <ul class="menu-list">
      <li v-for="(menu, index) in menus">

        <a v-if="menu.children && menu.children.length" :aria-expanded="isExpanded(menu)" @click="toggle(index, menu)">
          {{ menu.meta.label }}
          <span class="icon is-small is-angle" v-if="menu.children && menu.children.length">
            <icon name="arrow-down"></icon>
          </span>
        </a>
        <a v-else @click="menuClicked(menu)">
          {{ menu.meta.label }}
        </a>

        <expanding v-if="menu.children && menu.children.length">
          <ul v-show="isExpanded(menu)">
            <li v-for="subMenu in menu.children">
              <a @click="menuClicked(subMenu)">
                {{ subMenu.meta.label }}
              </a>
            </li>
          </ul>
        </expanding>
      </li>
    </ul>
  </aside>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import Expanding from 'vue-bulma-expanding'

  export default {
    name: 'Sidebar',
    components: {
      Expanding
    },
    computed: mapGetters({
      menus: 'menus'
    }),
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
        this.$bus.$emit('MENU_CLICKED', menu)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-sidebar {
    position: fixed;
    top: 52px;
    left: 0;
    botton: 0;
    padding: 0;
    width: 180px;
    height: 100vh;
    z-index: 1023;
    background-color: #3c3c3c;
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
        color: gray;
      }

      li ul {
        margin: 0 10px 0 -5px;
        color: gray;
      }
    }
  }
</style>
