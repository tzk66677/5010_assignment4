# Twitch Data Visualization

This project visualizes Twitch stream data using interactive charts, helping users explore stream times, follower counts, and language distribution. The data is loaded from a CSV file containing Twitch streamers' information, including stream time, follower count, and the language used by each channel.
https://editor.p5js.org/clarktan2002/sketches/sTviDH3M1

# Features

1. Stream Time Bar Chart
Displays the total stream time for the top 10 channels.
Each bar represents a channel, with the height corresponding to its stream time.
The bars have a dynamic RGB breathing effect for added visual appeal.
2. Followers Bar Chart
Displays the number of followers for each channel.
Clicking a channel reveals an additional bar showing the followers gained by that channel.
RGB breathing effects are also applied to these bars for visual enhancement.
3. Language Distribution Pie Chart
A pie chart shows the distribution of languages used by streamers.
Each slice represents a language, with the size corresponding to the percentage of streamers using it.
For languages with less than 1% of the total streamers, a table is displayed listing them with their respective percentages.
# How to Use

Space Bar: Switch between visualizations (Stream Time Bar Chart, Followers Bar Chart, and Language Distribution Pie Chart).
Mouse Click: Click on a bar in the Followers Bar Chart to reveal additional data on followers gained for that channel.
# Data Source

The data is loaded from a CSV file (twitch.csv), which contains the following columns:

Channel: The name of the Twitch channel.
Stream time (minutes): The total stream time for each channel.
Followers: The total number of followers for each channel.
Followers gained: The number of new followers gained by each channel.
Language: The primary language used by each channel.
