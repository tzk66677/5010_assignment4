let table;
let channels = [];
let streamTimes = [];
let followers = []; // Stores the follower count for the top 10 channels
let followersGained = []; // Stores the followers gained count
let languageCount = {};
let totalStreamers = 0;
let languagePercentages = [];
let smallLanguages = []; // Stores languages with less than 1% usage
let state = 'streamBarChart'; // Current state, default is stream time bar chart
let clickedIndexes = []; // Stores the indexes of clicked channels

function preload() {
  // Load CSV file
  table = loadTable('twitch.csv', 'csv', 'header');
}

function setup() {
  createCanvas(1200, 800); // Increase canvas width to display additional tables
  background(220);
  
  // Process data for bar chart
  for (let r = 0; r < min(table.getRowCount(), 10); r++) {
    let channel = table.getString(r, 'Channel');
    let streamTime = table.getNum(r, 'Stream time(minutes)');
    let follower = table.getNum(r, 'Followers');
    let gained = table.getNum(r, 'Followers gained'); // Get followers gained data
    
    channels.push(channel);
    streamTimes.push(streamTime);
    followers.push(follower);
    followersGained.push(gained); // Store followers gained
  }

  // Process data for pie chart
  for (let r = 0; r < table.getRowCount(); r++) {
    let language = table.getString(r, 'Language');
    
    if (!languageCount[language]) {
      languageCount[language] = 0;
    }
    languageCount[language] += 1;
    totalStreamers += 1;
  }

  // Calculate the percentage of each language
  for (let lang in languageCount) {
    let percentage = (languageCount[lang] / totalStreamers) * 100;
    
    if (percentage < 1) {
      // If the percentage is less than 1%, add it to smallLanguages array
      smallLanguages.push({ language: lang, percentage: percentage });
    } else {
      // Otherwise, add it to languagePercentages array
      languagePercentages.push({ language: lang, percentage: percentage });
    }
  }

  // Sort language percentages in descending order
  languagePercentages.sort((a, b) => b.percentage - a.percentage);

  // Display the initial chart (stream time bar chart)
  drawStreamBarChart();
}

function draw() {
  background(220); // Keep the background color fixed
  
  if (state === 'streamBarChart') {
    drawStreamBarChart(); // Draw stream time bar chart
  } else if (state === 'followerBarChart') {
    drawFollowerBarChart(); // Draw followers bar chart
  } else {
    drawPieChart(); // Draw pie chart
  }
}

function drawStreamBarChart() {
  let barWidth = width / channels.length;
  textSize(12);
  textAlign(CENTER, BOTTOM);

  for (let i = 0; i < channels.length; i++) {
    let barHeight = map(streamTimes[i], 0, max(streamTimes), 0, height - 50);
    let x = i * barWidth;
    let y = height - barHeight - 30;

    // Define different color offsets for each bar, using RGB gradient to create a breathing effect
    let r = map(sin(frameCount * 0.02 + i), -1, 1, 100, 255);
    let g = map(sin(frameCount * 0.02 + i + TWO_PI / 3), -1, 1, 100, 255);
    let b = map(sin(frameCount * 0.02 + i + TWO_PI * 2 / 3), -1, 1, 100, 255);
    
    fill(r, g, b);
    rect(x, y, barWidth - 10, barHeight);
    
    fill(0);
    text(channels[i], x + barWidth / 2 - 5, height - 15); // Display channel name

    fill(0);
    text(streamTimes[i], x + barWidth / 2 - 5, y - 5); // Display stream time number
  }
}

let showGained = false; // New variable to control whether to show followers gained bars

function drawFollowerBarChart() {
  let barWidth = (width / channels.length) * 0.7225; // Reduce bar width by 15%
  textSize(14); // Adjust font size
  textAlign(CENTER, CENTER); // Set text alignment

  // Draw y-axis
  stroke(0);
  line(50, height - 30, 50, 30); // y-axis
  for (let i = 0; i <= 10; i++) {
    let yValue = map(i, 0, 10, height - 30, 30);
    line(45, yValue, 55, yValue); // y-axis ticks
    textSize(12);
    text((i * 1000000).toFixed(0), 30, yValue); // y-axis values (each tick is 1,000,000)
  }

  for (let i = 0; i < channels.length; i++) {
    let barHeight = map(followers[i], 0, max(followers), 0, height - 50) * 0.85; // Reduce bar height by 15%
    let x = 50 + i * (width / channels.length); // Original width
    let y = height - barHeight - 30;

    // RGB breathing effect (for followers bars)
    let r = map(sin(frameCount * 0.02 + i), -1, 1, 100, 255);
    let g = map(sin(frameCount * 0.02 + i + TWO_PI / 3), -1, 1, 100, 255);
    let b = map(sin(frameCount * 0.02 + i + TWO_PI * 2 / 3), -1, 1, 100, 255);

    fill(r, g, b);
    rect(x + (width / channels.length) * 0.075, y, barWidth, barHeight); // Update bar position and size

    fill(255); // Use white font for visibility
    text(followers[i], x + (width / channels.length) * 0.075 + barWidth / 2, y + barHeight / 2); // Place followers count in the middle of the bar

    // Display channel name
    textSize(12);
    text(channels[i], x + (width / channels.length) * 0.075 + barWidth / 2, height - 15); // Display channel name

    // Check if the channel has been clicked and show followers gained bar
    if (clickedIndexes.length > 0) {
      let gainedHeight = map(followersGained[i], 0, max(followers), 0, barHeight * 0.5); // Adjust gained height based on followers' height
      let newY = y - gainedHeight; // New bar's y-coordinate

      // RGB breathing effect (for followers gained bars)
      let rNew = map(sin(frameCount * 0.02 + i + 100), -1, 1, 100, 255); // Use different phase for new bars
      let gNew = map(sin(frameCount * 0.02 + i + 100 + TWO_PI / 3), -1, 1, 100, 255);
      let bNew = map(sin(frameCount * 0.02 + i + 100 + TWO_PI * 2 / 3), -1, 1, 100, 255);

      fill(rNew, gNew, bNew); // Use breathing effect for color
      rect(x + (width / channels.length) * 0.075, newY, barWidth, gainedHeight); // Update new bar position and size

      fill(0);
      // Display followers gained count
      text(followersGained[i], x + (width / channels.length) * 0.075 + barWidth / 2, newY - gainedHeight / 2); 

      // Calculate total followers and followers gained and display it
      let totalSum = followers[i] + followersGained[i];
      fill(0);
      text(totalSum, x + (width / channels.length) * 0.075 + barWidth / 2, newY - gainedHeight - 10); // Display total above the bar
    }
  }

  // Draw x-axis
  stroke(0);
  line(50, height - 30, width - 10, height - 30); // x-axis
}

// Click event handling
function mousePressed() {
  // Clear clicked indexes
  clickedIndexes = [];
  // Add all channel indexes to show new followers gained bars
  for (let i = 0; i < channels.length; i++) {
    clickedIndexes.push(i);
  }
}

function drawPieChart() {
  let lastAngle = 0;
  let cx = width / 3;
  let cy = height / 2;
  let diameter = 400; // Pie chart diameter

  // Draw pie chart
  for (let i = 0; i < languagePercentages.length; i++) {
    let percentage = languagePercentages[i].percentage;
    let angle = radians((percentage / 100) * 360);

    // Define different color offsets for each slice, using RGB gradient for breathing effect
    let r = map(sin(frameCount * 0.02 + i), -1, 1, 100, 255);
    let g = map(sin(frameCount * 0.02 + i + TWO_PI / 3), -1, 1, 100, 255);
    let b = map(sin(frameCount * 0.02 + i + TWO_PI * 2 / 3), -1, 1, 100, 255);

    fill(r, g, b);
    arc(cx, cy, diameter, diameter, lastAngle, lastAngle + angle, PIE);

    let midAngle = lastAngle + angle / 2;
    let labelX = cx + cos(midAngle) * (diameter / 2 + 40); // Adjust label position
    let labelY = cy + sin(midAngle) * (diameter / 2 + 40);

    fill(0);
    textAlign(CENTER, CENTER);
    text(`${languagePercentages[i].language} (${percentage.toFixed(1)}%)`, labelX, labelY);

    lastAngle += angle;
  }

  // Display languages with less than 1% in a table
  drawSmallLanguagesTable();
}

function drawSmallLanguagesTable() {
  let tableX = width * 2 / 3 + 20; // Table position
  let tableY = 50;
  let rowHeight = 20;

  fill(0);
  textSize(16);
  text("Languages < 1%:", tableX, tableY - 20);

  textSize(12);
  textAlign(LEFT, CENTER);

  for (let i = 0; i < smallLanguages.length; i++) {
    let lang = smallLanguages[i].language;
    let percentage = smallLanguages[i].percentage.toFixed(2);
    
    text(`${lang}: ${percentage}%`, tableX, tableY + i * rowHeight);
  }
}

function mousePressed() {
  // Check if mouse click is within the bounds of a follower bar
  if (state === 'followerBarChart') {
    let barWidth = width / channels.length;

    for (let i = 0; i < channels.length; i++) {
      let barHeight = map(followers[i], 0, max(followers), 0, height - 50);
      let x = i * barWidth;
      let y = height - barHeight - 30;

      if (mouseX > x && mouseX < x + barWidth - 10 && mouseY > y && mouseY < height - 30) {
        if (!clickedIndexes.includes(i)) {
          clickedIndexes.push(i); // Add to clickedIndexes array if not clicked yet
        }
        return;
      }
    }
  }
}

function keyPressed() {
  if (key === ' ') {
    // Toggle between chart displays
    if (state === 'streamBarChart') {
      state = 'followerBarChart'; // Switch to followers bar chart
    } else if (state === 'followerBarChart') {
      state = 'pieChart'; // Switch to pie chart
    } else {
      state = 'streamBarChart'; // Switch back to stream time bar chart
    }
  }
}
