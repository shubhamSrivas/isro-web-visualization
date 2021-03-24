let lens;
const range = len => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const nextRow = (tabledata,idx) => {
  return {
    x: tabledata[idx]["serial no"],
    name: tabledata[idx].name,
    ra: tabledata[idx].ra,
    dec: tabledata[idx].dec,
    type: tabledata[idx].magnitude == '0' ? "High Mass " : "Low Mass",
    isObserved: (tabledata[idx].isObserved == 0 ? "No" : "Yes")
  }
}

export default function makeData(tabledata) {
  const makeDataLevel = (depth = 0) => {
    const len = tabledata.length
    let data = range(len).map(idx => {
      return {
        ...nextRow(tabledata,idx)
      }
    })
    console.log(data)
    return data;
  }

  return makeDataLevel()
}
