exports.writeFile = function (filename, data) {
    fs.writeFileSync(filename, data, "utf-8");
}

exports.initProject = (dir, appname)  => {
    alert(dir, appname)
}