export const child = {
  template: '<div>{{msg}}</div>',
  data () {
    return {
      msg: 'hello world'
    }
  },
  created () {
    console.log('child created')
  },
  mounted () {
    console.log('child mounted')
  }
}
