<script lang="ts">
  import Button from '@smui/button'
  import Textfield from '@smui/textfield'
  import Icon from '@smui/textfield/icon'
  import {format, parse, differenceInDays} from 'date-fns'

  let amount: number = 0
  let unit: number = 0
  $: total = unit * amount
  let shippingDate: Date = new Date()
  let shippingDateStr: string = format(shippingDate, 'yyyy-MM-dd')
  let shippingDateDiff: number = 0

  let descript: string = null
  const increment = () => {
    unit += 10
    amount += 10
  }
  const dateDiff = () => {
    shippingDateDiff = differenceInDays(new Date(), parse(shippingDateStr,'yyyy-MM-dd', new Date()))
  }
</script>

<div class="flexy-dad">
    <Textfield
      label="数量"
      type="number"
      bind:value={amount}
      variant="filled"
      suffix="kg"
      style="width:240px"
      input$style="text-align:right;"
      input$maxlength="8"
      input$autocomplete="on"
      disabled={false}
      required={true}
    >
      <Icon class="material-icons" slot="leadingIcon">event</Icon>
      <Icon class="material-icons" slot="trailingIcon">email</Icon>
    </Textfield>
    <Textfield
      label="単価"
      type="number"
      bind:value={unit}
      variant="filled"
      prefix="￥"
      suffix="円"
      style="width:240px"
      input$style="text-align:right;"
      input$maxlength="8"
      input$autocomplete="on"
      disabled={false}
      required={true}
    >
      <Icon class="material-icons" slot="leadingIcon">event</Icon>
      <Icon class="material-icons" slot="trailingIcon">email</Icon>
    </Textfield>
    <Textfield
      label="出荷日"
      type="date"
      bind:value={shippingDateStr}
      variant="filled"
      style="width:240px"
      input$style="text-align:left;"
      input$maxlength="10"
      input$autocomplete="on"
      disabled={false}
      required={true}
      on:change={dateDiff}
    >
      <Icon class="material-icons" slot="leadingIcon">event</Icon>
      <Icon class="material-icons" slot="trailingIcon">email</Icon>
    </Textfield>
    <Textfield
      label="説明"
      type="text"
      bind:value={descript}
      variant="filled"
      style="width:100%"
      input$style="text-align:left;"
      input$maxlength="10"
      input$autocomplete="on"
      disabled={false}
      required={false}
    >
      <Icon class="material-icons" slot="leadingIcon">event</Icon>
      <Icon class="material-icons" slot="trailingIcon">email</Icon>
    </Textfield>
</div>
<div>
  <div>
    数量：{amount}kg
  </div>
  <div>
    総額：{total}円
  </div>
  <div>
    出荷日：{shippingDateStr}
  </div>
  <div>
    本日 - 出荷日：{shippingDateDiff}日
  </div>
  <p>
    <Button on:click={increment} variant="raised">
      数量・単価 + 10
    </Button>
  </p>
</div>

<style>
  .flexy-dad {
    display: flex;
    flex-wrap: wrap;
  }
</style>