import axios from "axios";
export async function banksData() {
  const data = axios.get('/api/banks.json')
    .then(res => { return (res.data) },
    )
    .catch(error => { return (error); });
  return data
}

export async function deleteBank(id: number) {
  const data = await axios.delete('/api/banks/' + id)
  if (data.status === 200) { return data.data; }
  else { throw new Error(data.statusText); }
}

//creating the API call point for the frontend.
export async function updateBankDetails(id, newData) {
  const data = await axios.put('/api/banks/updateName/' + id, {
    newData: newData
  })

  if(data.status === 200) {
    return data.data
  }
  else throw new Error(data.statusText)
}