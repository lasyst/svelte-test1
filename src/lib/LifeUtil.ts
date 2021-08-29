import axios, { AxiosResponse } from 'axios'

export async function serverCommunication(reqUrl?: string, form?: any, viewActId?: string, token?: string): Promise<AxiosResponse> {

  console.log("reqUrl..." + reqUrl)
  console.dir(form)
  console.dir(viewActId)
  // console.log("access_token...this.$store.state.accessToken")
  
  const url = String(import.meta.env.VITE_SERVER_BASE_URL) + "/" + reqUrl

  const data = new FormData()
  data.append("token", JSON.stringify(token))
  data.append("form", JSON.stringify(form))
  data.append("view_act_id", JSON.stringify(viewActId));
  const headers = { "content-type": "multipart/form-data" }
  return await axios.post(url, data, { headers })
}
