'use strict';

/*global tsosim*/

function setupDiagramLine(key, value, value_filtered, total) {
    var div, round, line, barCont, barT, barF, percent;
    div = document.createElement("div");
    div.setAttribute("class", "diagRow");
    
    round = document.createElement("div");
    round.setAttribute("class", "diagLeftValue");
    round.innerHTML = key;
    div.appendChild(round);
    
    line = document.createElement("div");
    line.setAttribute("class", "diagLine");
    div.appendChild(line);
    
    barCont = document.createElement("div");
    barCont.setAttribute("class", "diagBarContainer");
    
    barT = document.createElement("div");
    barT.setAttribute("class", "diagBarTotal");
    barT.style.width = (100 * value / total) + "%";
    barT.setAttribute("title", barT.style.width + " - " + value + "/" + total);
    
    barF = document.createElement("div");
    barF.setAttribute("class", "diagBarFiltered");
    barF.style.width = (100 * value_filtered / total) + "%";
    barF.setAttribute("title", barF.style.width + " - " + value_filtered + "/" + total);
    
    barCont.appendChild(barF);
    barCont.appendChild(barT);
    div.appendChild(barCont);
    
    percent = document.createElement("div");
    percent.setAttribute("class", "diagPercent");
    percent.setAttribute("title", value + "/" + total);
    percent.innerHTML = (100 * value / total).toFixed(2) + " %";
    div.appendChild(percent);
    
    return div;
}

function setupDiagramLegend(textVictory, textDefeat, textTotal) {
    var div, span1, span2, span3, span4;
    div = document.createElement("div");
    div.setAttribute("class", "diagLegend");
    
    span1 = document.createElement("span");
    span1.setAttribute("class", "diagLegendVictory");
    div.appendChild(span1);
    
    span2 = document.createElement("span");
    span2.setAttribute("class", "diagLegendText");
    span2.innerHTML = textVictory;
    div.appendChild(span2);

    span3 = document.createElement("span");
    span3.setAttribute("class", "diagLegendDefeat");
    div.appendChild(span3);
    
    span4 = document.createElement("span");
    span4.setAttribute("class", "diagLegendText");
    span4.innerHTML = textDefeat;
    div.appendChild(span4);

    /*
    var span5 = document.createElement("span");
    span5.setAttribute("class", "diagLegendTotal");
    div.appendChild(span5);
    
    var span6 = document.createElement("span");
    span6.setAttribute("class", "diagLegendText");
    span6.innerHTML = textTotal;
    div.appendChild(span6);
    */
    return div;
}

function setupDiagram(histo, total, title, diagID) {
    var node, t, j;
    /*var total = 0;
    for(var i = 0; i < arr.length; i += 1) {
        total += arr[i];
    }*/
    
    node = document.createElement("div");
    node.setAttribute("class", "diagram");
    node.setAttribute("id", diagID);
    
    t = document.createElement("div");
    t.setAttribute("class", "diagTitle");
    t.innerHTML = title;
    node.appendChild(t);
    
    node.appendChild(setupDiagramLegend("Victory", "Total"));
    
    for (j in histo) {
        if (histo.hasOwnProperty(j)) {
            node.appendChild(setupDiagramLine(j, histo[j].total, histo[j].filtered, total));
        }
    }
    
    return node;
}

function setupDiagrams(node, stats, title, diagID, filterFun) {
    var data, j, group, g, i, total;
    data = {};
    
    // initialize
    for (j = stats.rounds.statistics.stat_min; j <= stats.rounds.statistics.stat_max; j += 1) {
        data[j] = {total : 0, filtered : 0};
    }
    
    group = null;
    for (g in tsosim.generals) {
        if (tsosim.generals.hasOwnProperty(g)) {
            if (stats.data.hasOwnProperty(tsosim.lang.unit[tsosim.generals[g].id])) {
                group = stats.data[tsosim.lang.unit[tsosim.generals[g].id]].iterationResults;
                break;
            }
        }
    }
    
    // create histogram
    total = 0;
    for (i = 0; i < stats.rounds.iterationResults.length; i += 1) {
        data[stats.rounds.iterationResults[i]].total += 1;
        if (group !== null && filterFun(group[i])) {
            data[stats.rounds.iterationResults[i]].filtered += 1;
        }
        total += 1;
    }
    
    //node.appendChild(setupDiagram(data, total, title, diagID));
    return setupDiagram(data, total, title, diagID);
}

// ------------------------------------------------------------------------------------------------------------- //

function setupInnerColumn(filtered, total, colValue, attrValue, widthClass, scaling) {
    var inlineBlock, barF, barFpc, innerValue;
    inlineBlock = document.createElement("div");
    inlineBlock.setAttribute("class", "diagInnerCol " + widthClass);
    inlineBlock.style.height = "100%";
    
    innerValue = filtered / total;
    
    barF = document.createElement("div");
    barF.setAttribute("class", attrValue);
    barF.style.height = (100 * (innerValue) / colValue) + "%";
    //barF.setAttribute("title", (100 * innerValue).toFixed(2) + "% - " + filtered + "/" + total);
    
    if (innerValue > 0.0) {
        barFpc = document.createElement("div");
        if ((innerValue / colValue) < 0.8 || scaling < 0.75) {
            barFpc.setAttribute("class", "innerColText textOut");
        } else {
            barFpc.setAttribute("class", "innerColText");
        }
        barFpc.innerHTML = (100 * innerValue).toFixed(2) + " %";

        barF.appendChild(barFpc);
    }

    inlineBlock.appendChild(barF);
    
    return inlineBlock;
}


function setupDiagramEmptyColumn() {
    var div, round, line;
    div = document.createElement("div");
    div.setAttribute("class", "diagCol");
    
    round = document.createElement("div");
    round.setAttribute("class", "diagBottomValue");
    round.innerHTML = " - ";
    div.appendChild(round);
    
    line = document.createElement("div");
    line.setAttribute("class", "diagBorderLine");
    div.appendChild(line);

    return div;
}

function setupDiagramColumn(key, value, total, scaling, numRounds) {
    var div, widthClass, round, line, barCont, columnValue, barT, barF, barV, percent;
    div = document.createElement("div");
    div.setAttribute("class", "diagCol");
    
    if (numRounds < 10) {
        widthClass = "widthNormal";
    } else if (numRounds < 15) {
        widthClass = "widthSmall";
    } else if (numRounds < 20) {
        widthClass = "widthTiny";
    } else {
        widthClass = "widthMin";
    }
    
    round = document.createElement("div");
    round.setAttribute("class", "diagBottomValue " + widthClass);
    round.innerHTML = key;
    div.appendChild(round);
    
    line = document.createElement("div");
    line.setAttribute("class", "diagBorderLine");
    div.appendChild(line);
    
    barCont = document.createElement("div");
    barCont.setAttribute("class", "diagColContainer");
    
    columnValue = value.total / total;
    
    //scaling = 1;
    
    barT = document.createElement("div");
    barT.setAttribute("class", "diagColTotal " + widthClass);
    barT.style.height = (100 * columnValue * scaling) + "%";
    barT.setAttribute("title", (100 * columnValue).toFixed(2) + "% - " + value.total + "/" + total);
    
    barT.onmouseover = function () {
        barT.setAttribute("class", "diagColTotal mouseOver " + widthClass);
    };
    barT.onmouseout = function () {
        barT.setAttribute("class", "diagColTotal " + widthClass);
    };
    
    barF = setupInnerColumn(value.victory, total, columnValue, "diagColVic", widthClass, columnValue * scaling);
    barV = setupInnerColumn(value.defeat, total, columnValue,  "diagColDef", widthClass, columnValue * scaling);
    
    var title = tsosim.lang.ui.victory + ": " + (100 * value.victory / total).toFixed(2) + "% (" + value.victory + "/" + total + "), ";
    title += tsosim.lang.ui.defeat + ": " + (100 * value.defeat / total).toFixed(2) + "% - " + value.defeat + "/" + total;
    
    barF.setAttribute("title", title);
    barV.setAttribute("title", title);
    
    barT.appendChild(barF);
    barT.appendChild(barV);
    
    barCont.appendChild(barT);
    div.appendChild(barCont);
    
    percent = document.createElement("div");
    percent.setAttribute("class", "diagColPercent " + widthClass);
    percent.setAttribute("title", value.total + "/" + total);
    percent.innerHTML = (100 * value.total / total).toFixed(2) + "%";
    div.appendChild(percent);
    
    return div;
}

function setupHDiagram(histo, total, title, diagID, numRounds) {
    var node, t, columns, maxHeight, j;
    
    node = document.createElement("div");
    node.setAttribute("class", "diagram");
    node.setAttribute("id", diagID);
    
    t = document.createElement("div");
    t.setAttribute("class", "diagTitle");
    t.innerHTML = title;
    node.appendChild(t);
    
    node.appendChild(setupDiagramLegend(tsosim.lang.ui.victory, tsosim.lang.ui.defeat, "Total"));
    
    columns = document.createElement("div");
    columns.setAttribute("class", "diagColumns");

    maxHeight = 0;
    for (j in histo) {
        if (histo.hasOwnProperty(j)) {
            if (maxHeight < histo[j].total) {
                maxHeight = histo[j].total;
            }
        }
    }
    // determine scaling factor
    maxHeight = 0.90 / (maxHeight / total);
    
    
    if (numRounds < 6) {
        columns.appendChild(setupDiagramEmptyColumn());
    }
    for (j in histo) {
        if (histo.hasOwnProperty(j)) {
            columns.appendChild(setupDiagramColumn(j, histo[j], total, maxHeight, numRounds));
        }
    }
    if (numRounds < 6) {
        columns.appendChild(setupDiagramEmptyColumn());
    }
    node.appendChild(columns);
    
    return node;
}

function setupHorizontalDiagram(node, simStats, waveIdx, title, diagID, filter1, filter2) {
    var data, j, group, g, numRounds, total, i, groupData, stats, countRounds, iterResults;
    data = {};

    // define function to count victories/defeats if we look at the defending garrison (if it has a camp)
    countRounds = function (sdata, iters) {
        if (iters > 0) {
            sdata.defeat += 1;
        } else {
            sdata.victory += 1;
        }
    };
    
    stats = simStats.defender[waveIdx];
    numRounds = stats.rounds.statistics.stat_max - stats.rounds.statistics.stat_min + 1;
    
    // initialize
    for (j = stats.rounds.statistics.stat_min; j <= stats.rounds.statistics.stat_max; j += 1) {
        data[j] = {total : 0, victory : 0, defeat : 0};
    }
    
    groupData = simStats.defender[waveIdx].getRealCampGroupData();
    if (groupData === null) {
        // if there is no camp, then look at the general
        groupData = simStats.attacker[waveIdx].getGeneralGroupData();
        stats     = simStats.attacker[waveIdx];
        // redefine function to count victories/defeats
        countRounds = function (sdata, iters) {
            if (iters > 0) {
                sdata.victory += 1;
            } else {
                sdata.defeat += 1;
            }
        };
    }
    
    iterResults = stats.rounds.iterationResults;
    // create histogram
    total = 0;
    for (i = 0; i < iterResults.length; i += 1) {
        data[iterResults[i]].total += 1;
        if (groupData !== null) {
            countRounds(data[iterResults[i]], groupData.iterationResults[i]);
        }
        total += 1;
    }
    
    return setupHDiagram(data, total, title, diagID, numRounds);
}

