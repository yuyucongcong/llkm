
let filter = []

let filterData = {
    // be 动词
    be:['am','is','are','was','were','been'],
    // 动词
    verb:['do','did','done','doing','can','could','may','might','must','shall','should','will','would'],
    // 代词
    pron:['i','me','us','we','you','he','him','she','her','it','they','them','my','your',
    'his','its','our','yours','their','theirs','ours','mine','what','who','whose','whom','which',
    'whatever','whichever','whoever','whomever','who','that','which','this','there','somebody',
    'anybody','everybody','nobody','someone','anyone','everyone','no one','something','anyting',
    'everything','nothing','all','an','other','any','both','each','either','few','little','many','much','neither','none','some']
}

filter = filter.concat(filterData.be, filterData.verb, filterData.pron)
function isFilter(element){
    return (filter.indexOf(element) > -1).toString()
}

export { filter, isFilter, filterData }