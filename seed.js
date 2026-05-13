require('dotenv').config();
const mongoose = require('mongoose');
const State = require('./model/State');

const seedData = [
    {
        stateCode: 'KS',
        funfacts: [
            "A ball of twine in Cawker City measures over 38 feet in circumference, weighs more than 16,750 pounds, and is still growing.",
            "A grain elevator in Hutchinson is half a mile long and holds 46 million bushels in its 1,000 bins.",
            "South of Ashland, the Rock Island Bridge is the longest railroad bridge of its kind — 1,200 feet long and 100 feet above the Cimarron River.",
            "Kansas won the award for most beautiful license plate for the wheat-plate design issued in 1981.",
            "At one time it was against the law to serve ice cream on cherry pie in Kansas."
        ]
    },
    {
        stateCode: 'MO',
        funfacts: [
            "The expression 'Show Me State' may have begun in 1899 when Congressman Willard Duncan Vandiver stated, 'I'm from Missouri and you've got to show me.'",
            "The first successful parachute jump from a moving airplane was made by Captain Berry at St. Louis in 1912.",
            "Missouri's state bird is the Bluebird (Sialia sialis).",
            "Missouri's official state flower is the White Hawthorn Blossom.",
            "At the 1904 St. Louis World's Fair, Richard Blechyden invented iced tea by serving tea with ice.",
            "Missouri's state flag was adopted on March 22, 1913."
        ]
    },
    {
        stateCode: 'OK',
        funfacts: [
            "Oklahoma's state bird, the Scissor-Tailed Flycatcher, has a deeply-forked tail twice as long as its body — resembling a pair of scissors.",
            "Oklahoma has the largest Native American population of any state in the U.S. — about 250,000 — and is tribal headquarters for 39 tribes.",
            "The Oklahoma City National Memorial honors the victims, survivors, and rescuers of the April 19, 1995 bombing in Oklahoma City.",
            "Chickasaw National Recreation Area was the first national park in Oklahoma; it lies in a transition zone where the Eastern deciduous forest and the Western prairies meet."
        ]
    },
    {
        stateCode: 'NE',
        funfacts: [
            "The Lied Jungle in Omaha is the world's largest indoor rain forest.",
            "Nebraska has the U.S.'s largest aquifer, the Ogallala Aquifer.",
            "Nebraska has more miles of river than any other state.",
            "The Union Pacific's Bailey Yards in North Platte is the largest rail classification complex in the world."
        ]
    },
    {
        stateCode: 'CO',
        funfacts: [
            "Colorado is the only state in history to turn down the Olympics. In 1976, the Winter Olympics were planned for Denver, but 62% of state voters chose not to host due to cost, pollution, and population concerns.",
            "The United States Air Force Academy is located in Colorado Springs.",
            "Colorado has 222 state wildlife areas.",
            "Colfax Avenue in Denver is the longest continuous street in America.",
            "The tallest building in Colorado is the Republic Plaza in Denver, at 57 stories high.",
            "The world's largest natural hot springs pool is in Glenwood Springs. The two-block-long pool sits across from the historic Hotel Colorado, a favorite stop of former president Teddy Roosevelt.",
            "Built in 1867 by Seth Lake, the Astor House in Golden was the first stone hotel built west of the Mississippi River."
        ]
    },
    // Bonus states (not required by the spec)
    {
        stateCode: 'IA',
        funfacts: [
            "Iowa's smallest city park is in the middle of the road in Hiteman.",
            "Scranton is home to Iowa's oldest water tower still in service.",
            "Elk Horn is the largest Danish settlement in the United States.",
            "At 16 miles, East Okoboji is the longest natural lake in Iowa.",
            "Kalona is the largest Amish community west of the Mississippi River.",
            "Iowa is the only state whose east and west borders are 100% formed by water — the Missouri and Mississippi rivers."
        ]
    },
    {
        stateCode: 'PA',
        funfacts: [
            "Pennsylvania was the first of the fifty United States to list its website URL on a license plate.",
            "In 1909, the first baseball stadium was built in Pittsburgh.",
            "Hershey is considered the Chocolate Capital of the United States.",
            "In 1775 in Philadelphia, Johann Behrent built the first piano in America, calling it the 'Piano Forte.'"
        ]
    },
    {
        stateCode: 'OR',
        funfacts: [
            "Oregon's state flag features a beaver on its reverse side — the only state flag with two separate designs.",
            "The Douglas Fir is Oregon's official state tree.",
            "Oregon's official state motto is 'Alis volat propriis' — 'She flies with her own wings.'",
            "Hells Canyon is the deepest river gorge in North America at roughly 8,000 feet deep.",
            "The hazelnut (also known as the filbert) is Oregon's official state nut — Oregon is the only state with an official state nut.",
            "Oregon's statehood day is February 14, Valentine's Day."
        ]
    }
];

(async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log('Connected to MongoDB');

        for (const entry of seedData) {
            if (!entry.funfacts.length) {
                console.log(`skipped ${entry.stateCode}: no facts in script (TODO)`);
                continue;
            }
            const result = await State.findOneAndUpdate(
                { stateCode: entry.stateCode },
                { stateCode: entry.stateCode, funfacts: entry.funfacts },
                { upsert: true, returnDocument: 'after' }
            );
            console.log(`seeded ${entry.stateCode}: ${result.funfacts.length} facts`);
        }
    } catch (err) {
        console.error('seed failed:', err);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        console.log('disconnected');
    }
})();
