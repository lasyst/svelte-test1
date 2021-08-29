<script lang="ts">
  import { onMount } from 'svelte'
  import MainView from './lib/MainView.svelte'
  import { serverCommunication } from './lib/LifeUtil'

  // 自動実行する処理を実行
  let actsetTimerIds :NodeJS.Timer[] = []

  let model = {
    app: {
      app_id: String(import.meta.env.VITE_INIT_APP_ID),
      app_name: null,
      db_type: String(import.meta.env.VITE_INIT_DB_TYPE),
    },
    user: {
      user_id: null,
      user_name: null,
      user_locale: String(import.meta.env.VITE_INIT_LOCALE),
      last_login_date: null,
    },
    view: {
      title: null,
      act_id: null,
      auto_actset: null,
      is_autofocus: null,
      parts_list: null,
      parts: {
        id: null,
        label: null,
        parts: {
          id: null,
          parts_type: null,
          label: null,
          left_icon_type: null,
          right_icon_type: null,
          submit_parts_id: null,
          is_pwd: null,
          max_length: Number,
        },
        width: null,
        horizontal: null,
        is_toggleable: null,
        is_collapsed: null,
      },
    },
    actset_form: {},
    token: null,
    form: null
  }

  const defLocale = [
    {label: '日本語', value: 'ja'},
    {label: 'English', value: 'en'},
  ]
  
  onMount(async () => {
    await postServer(String(import.meta.env.VITE_INIT_ACTSET_ID))
  })

  async function postServer(actsetId: string) {

    let form: any = {}
    let formIds = model.actset_form[actsetId]
    if (formIds) {
      formIds.forEach ((formId: string) => {
        form[formId] = model.form[formId]
      })
    }

    let url = model.app.app_id + "/" +  model.app.db_type + "/" + actsetId + "/" + model.user.user_locale

    await serverCommunication(url, form, "", model.token)
    .then(res => {
      console.log(res)
      model.app = res.data.app ? res.data.app : model.app
      model.user = res.data.user ? res.data.user : model.user
      model.token = res.data.token ? res.data.token : model.token
      model.actset_form = res.data.actset_form ? res.data.actset_form : model.actset_form
      model.view = res.data.view ? res.data.view : model.view
      model.form = res.data.view ? null : model.form
      model.form = setupForm(model.view.parts_list, model.form, res.data.form)        
      console.log(model)

      // 画面が更新されていれば、自動実行処理を実行
      if (res.data.view) {
        autoExecActset(model.view.auto_actset)
      }
      // メッセージを受信していれば表示
      showMessage(res.data.msg)
    })
    .catch(function(e) {
      console.error(e)
      let msg: any = {
        "msg_type": "e",
        "msg_body": "Server Error",
        "msg_detail": e,
      }
      showMessage(msg)
    })
  }

  // メッセージを受信していれば表示
  function showMessage(msg: any) {
    if (!msg) return

    let severity
    
    switch (msg.msg_type) {
      case 's':
        severity = "success"
        break
      case 'i':
        severity = "info"
        break
      case 'w':
        severity = "warn"
        break
      case 'e':
        severity = "error"
        break
    }
  }

  function autoExecActset(autoActset: any) {

    // すでに自動実行している処理があればすべて停止
    actsetTimerIds.forEach ((timerId: NodeJS.Timer) => {
      clearInterval(timerId)
    })

    if (!autoActset) return
    autoActset.forEach ((actset: any) => {
      if (actset.term_sec > 0) {
        const timerId: NodeJS.Timer = setInterval(
          function() {
            postServer(actset.actset_id)
          },
          actset.term_sec * 1000
        )
        actsetTimerIds.push(timerId)
      }
      else {
        postServer(actset.actset_id)
      }
    })
  }

  function setupForm(partsList: any, modelForm: any, resForm: any) {

    let form = !modelForm ? {} : modelForm

    if (!partsList) return form

    partsList.forEach ((parts: any) => {
      if (parts.form_id) {
        if (!form[parts.form_id]) {
          form[parts.form_id] = []
          form[parts.form_id].push({})
        }
        if (parts.parts_id) {   
          if (parts.parts_type === "DataGrid") {
            // サーバーから取得した値があれば設定            
            if (resForm && resForm[parts.form_id]) {
              form[parts.form_id] = resForm[parts.form_id]
            }
          }         
          else {
            if (!form[parts.form_id][0][parts.parts_id]) {
              let partsValue
              // サーバーから取得した値があれば設定            
              if (resForm && resForm[parts.form_id] && resForm[parts.form_id][0][parts.parts_id]) {
                partsValue = resForm[parts.form_id][0][parts.parts_id]
              }
              // サーバーから取得した値がなければ初期化
              else {            
                partsValue = []
                partsValue.push("")
              }
              form[parts.form_id][0][parts.parts_id] = partsValue
            }
          }
        }        
      }

      if (parts.parts_list) {
        form = setupForm(parts.parts_list, form, resForm)
      }

    })
    return form
  }

  async function changeLocale() {

    let url = model.app.app_id + "/" +  model.app.db_type + "/" + String(import.meta.env.VITE_LOCALE_ACTSET_ID) + "/" + model.user.user_locale

    await serverCommunication(url, null, model.view.act_id, model.token)
    .then(res => {
      console.log(res)
      model.view = res.data.view

      // メッセージを受信していれば表示
      if (res.data.msg) {
/*        toast.add({
          severity: res.data.msg.msg_type,
          summary: res.data.msg.msg_body,
          detail: res.data.msg.msg_detail,
          life: 3000
        })
*/      }
    })
    .catch(function(e) {
      console.error(e)
    })
  }

</script>

<main>
  <MainView/>
</main>