function addProcess() {
    var processId = document.getElementById("processid").value;
    var arrivalTime = parseInt(document.getElementById("arrivaltime").value);
    var burstTime = parseInt(document.getElementById("bursttime").value);

    var tableRef = document.getElementById("input-table").getElementsByTagName('tbody')[0];

    var newRow = tableRef.insertRow();
    var newCell1 = newRow.insertCell(0);
    var newCell2 = newRow.insertCell(1);
    var newCell3 = newRow.insertCell(2);

    newCell1.appendChild(document.createTextNode(processId));
    newCell2.appendChild(document.createTextNode(arrivalTime));
    newCell3.appendChild(document.createTextNode(burstTime));
}

function calculate() {
    var algorithm = document.getElementById("algo").value;
    if (algorithm === "FCFS") {
        calculateFCFS();
    } else if (algorithm === "SJF") {
        calculateSJF();
    }
}

function calculateFCFS() {
    var inputTable = document.getElementById("input-table");
    var inputRows = inputTable.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    var outputData = [];
    var totalTurnaroundTime = 0;
    var totalWaitingTime = 0;

    var currentTime = 0; // Initialize current time

    for (var i = 0; i < inputRows.length; i++) {
        var cells = inputRows[i].getElementsByTagName("td");
        // var processId = cells[0].innerText;
        var arrivalTime = parseInt(cells[1].innerText);
        var burstTime = parseInt(cells[2].innerText);

        // Calculate Completion Time (time at which process completes its execution)
        var completionTime = currentTime + burstTime;

        // Calculate Waiting Time (time spent waiting in the queue)
        var waitingTime = Math.max(currentTime - arrivalTime, 0);

        // Calculate Turnaround Time (time from arrival to completion)
        var turnaroundTime = waitingTime + burstTime;

        // Update current time for the next process
        currentTime += burstTime;

        // Accumulate total turnaround time and waiting time
        totalTurnaroundTime += turnaroundTime;
        totalWaitingTime += waitingTime;

        outputData.push({
            col1: arrivalTime,
            col2: burstTime,
            col3: completionTime,
            col4: turnaroundTime,
            col5: waitingTime
        });
    }

    // Calculate average turnaround time and waiting time
    var avgTurnaroundTime = totalTurnaroundTime / inputRows.length;
    var avgWaitingTime = totalWaitingTime / inputRows.length;

    // Update output table
    var outputTable = document.getElementById("output-table");
    var tbody = outputTable.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";

    outputData.forEach(function (data) {
        var row = tbody.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);

        cell1.appendChild(document.createTextNode(data.col1));
        cell2.appendChild(document.createTextNode(data.col2));
        cell3.appendChild(document.createTextNode(data.col3));
        cell4.appendChild(document.createTextNode(data.col4));
        cell5.appendChild(document.createTextNode(data.col5));
    });

    // Add row for average turnaround time and waiting time
    var avgRow = tbody.insertRow();
    var avgTurnaroundCell = avgRow.insertCell(0);
    avgTurnaroundCell.colSpan = 3;
    avgTurnaroundCell.appendChild(document.createTextNode("Average Turnaround Time: " + avgTurnaroundTime.toFixed(2)));

    var avgWaitingCell = avgRow.insertCell(1);
    avgWaitingCell.colSpan = 2;
    avgWaitingCell.appendChild(document.createTextNode("Average Waiting Time: " + avgWaitingTime.toFixed(2)));
}

function calculateSJF() {
    var inputTable = document.getElementById("input-table");
    var inputRows = inputTable.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    var outputData = [];
    var totalTurnaroundTime = 0;
    var totalWaitingTime = 0;

    // Convert NodeList to array and sort by arrival time and burst time
    var sortedProcesses = Array.from(inputRows).sort((a, b) => {
        var aArrivalTime = parseInt(a.getElementsByTagName("td")[1].innerText);
        var bArrivalTime = parseInt(b.getElementsByTagName("td")[1].innerText);
        var aBurstTime = parseInt(a.getElementsByTagName("td")[2].innerText);
        var bBurstTime = parseInt(b.getElementsByTagName("td")[2].innerText);

        // If arrival times are equal, sort by burst time
        if (aArrivalTime === bArrivalTime) {
            return aBurstTime - bBurstTime;
        } else {
            return aArrivalTime - bArrivalTime; // Sort in ascending order of arrival time
        }
    });

    var currentTime = 0;
    while (sortedProcesses.length > 0) {
        var availableProcesses = sortedProcesses.filter(row => parseInt(row.getElementsByTagName("td")[1].innerText) <= currentTime);

        if (availableProcesses.length === 0) {
            // No process available at current time, move time to the next arrival
            currentTime = parseInt(sortedProcesses[0].getElementsByTagName("td")[1].innerText);
            continue;
        }

        // Sort available processes by burst time
        availableProcesses.sort((a, b) => parseInt(a.getElementsByTagName("td")[2].innerText) - parseInt(b.getElementsByTagName("td")[2].innerText));

        var selectedProcess = availableProcesses[0]; // Process with shortest burst time
        var cells = selectedProcess.getElementsByTagName("td");
        var processId = cells[0].innerText;
        var arrivalTime = parseInt(cells[1].innerText);
        var burstTime = parseInt(cells[2].innerText);

        // Calculate Completion Time (time at which process completes its execution)
        var completionTime = currentTime + burstTime;

        // Calculate Waiting Time (time spent waiting in the queue)
        var waitingTime = currentTime - arrivalTime;

        // Calculate Turnaround Time (time from arrival to completion)
        var turnaroundTime = waitingTime + burstTime;

        // Accumulate total turnaround time and waiting time
        totalTurnaroundTime += turnaroundTime;
        totalWaitingTime += waitingTime;

        // Store data for output
        outputData.push({
            col1: arrivalTime,
            col2: burstTime,
            col3: completionTime,
            col4: turnaroundTime,
            col5: waitingTime
        });

        // Update current time for the next process
        currentTime = completionTime;

        // Remove selected process from the list
        var index = sortedProcesses.indexOf(selectedProcess);
        if (index !== -1) {
            sortedProcesses.splice(index, 1);
        }
    }

    // Calculate average turnaround time and waiting time
    var avgTurnaroundTime = totalTurnaroundTime / inputRows.length;
    var avgWaitingTime = totalWaitingTime / inputRows.length;

    // Update output table
    var outputTable = document.getElementById("output-table");
    var tbody = outputTable.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";

    outputData.forEach(function (data) {
        var row = tbody.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);

        cell1.appendChild(document.createTextNode(data.col1));
        cell2.appendChild(document.createTextNode(data.col2));
        cell3.appendChild(document.createTextNode(data.col3));
        cell4.appendChild(document.createTextNode(data.col4));
        cell5.appendChild(document.createTextNode(data.col5));
    });

    // Add row for average turnaround time and waiting time
    var avgRow = tbody.insertRow();
    var avgTurnaroundCell = avgRow.insertCell(0);
    avgTurnaroundCell.colSpan = 3;
    avgTurnaroundCell.appendChild(document.createTextNode("Average Turnaround Time: " + avgTurnaroundTime.toFixed(2)));

    var avgWaitingCell = avgRow.insertCell(1);
    avgWaitingCell.colSpan = 2;
    avgWaitingCell.appendChild(document.createTextNode("Average Waiting Time: " + avgWaitingTime.toFixed(2)));
}

function resetInputs() {
    document.getElementById("algo").selectedIndex = 0; // Reset dropdown
    document.getElementById("processid").value = ""; // Clear process ID
    document.getElementById("arrivaltime").value = ""; // Clear arrival time
    document.getElementById("bursttime").value = ""; // Clear burst time

    // Reset input table
    var inputTableBody = document.getElementById("input-table").getElementsByTagName('tbody')[0];
    inputTableBody.innerHTML = "";

    // Reset output table
    var outputTableBody = document.getElementById("output-table").getElementsByTagName('tbody')[0];
    outputTableBody.innerHTML = "";
}