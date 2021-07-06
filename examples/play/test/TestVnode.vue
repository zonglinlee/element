<script>
export default {
  name: "TestVnode",
  data() {
    return {
      counter: 0
    }
  },
  render(createElement, context) {
    return createElement(
        'div',
        [
          createElement(
              'button',
              {
                on: {
                  click: () => this.counter++,
                }
              },
              'Click to increase counter'
          ),
          createElement(
              'p',
              `You've clicked the button ${this.counter} times`
          )
        ]
    );
  }
}
</script>

<style scoped>

</style>
