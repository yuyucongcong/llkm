
let filter = []

let filterData = {
    // be 动词
    be:['am','is','are','was','were','been'],
    // 动词
    verb:['do','did','done','doing','does','can','could','may','might','must','shall','should','will',
    'would','use','using','used','want'],
    // 代词
    pron:['i','me','us','we','you','he','him','she','her','it','they','them','my','your','from',
    'his','its','our','yours','their','theirs','ours','mine','what','who','whose','whom','which',
    'whatever','whichever','whoever','whomever','who','that','which','this','there','somebody',
    'anybody','everybody','nobody','someone','anyone','everyone','no one','something','anyting',
    'everything','nothing','all','an','other','any','both','each','either','few','little','many',
    'these','much','neither','none','some','when','such','into'],
    // 副词
    adv:['else','no','not','within','by','just','here','without','also','too','so','then','yet','how',
    'why','where','sure'],
    // 形容词
    adj:['most'],
    // 冠词
    art:['the'],
    // 介词
    prep:['to','of','as','in','on','at','with','for'],
    // 连词
    conj:['and','be','if','or','but','before'],
    // 助词
    aux:['have','has'],
    // 字母
    alphabet:['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
    // 数字
    nub:['one','two'],
    // 人名
    named:['mary','samantha'],
    // 简写或其他
    other:['af','tz','arr','fe','err','id','eg','don','api','var']
}

filter = filter.concat(filterData.be, filterData.verb, filterData.pron, filterData.adv, filterData.art, filterData.prep, filterData.conj, filterData.aux, filterData.alphabet, filterData.nub, filterData.named,filterData.other)
function isFilter(element){
    return (filter.indexOf(element) > -1).toString()
}

export { filter, isFilter, filterData }