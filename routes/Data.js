 const birthDescriptions = {
    11: { title: "The Visionary", description: "The number eleven is a higher octave of number two. You are a highly intuitive individual. You draw your strength from your spiritual nature. You are highly motivated in whatever you do in your life. You have strong foresight which helps you a lot. You are a helpful person and people love you for this fact." },
    22: { title: "The Spiritual", description: "The number twenty-two is a higher octave of number four. You are very spiritual in everything that you do. At the same time, you are highly organized and disciplined in your work. You have leadership skills that will bring success to you. You have a strong psychic sense which helps you in making correct decisions." },
    1: { title: "The Innovator", description: "The number one is associated with new beginnings. You are an original person. You constantly get ideas about doing something new. You are full of positive energy and very ambitious in life. You love to take initiatives and are most likely to assume leadership positions. You prefer to be self-reliant and don't take help from others." },
    2: { title: "The Diplomat", description: "The number two is associated with peace and harmony. You are tactful in your dealings with people. People turn to you when there is a need to restore peace and order. You maintain balance in your thoughts and actions. You like maintaining very good relations with your family, friends, relatives, and work colleagues. You are a large-hearted person." },
    3: { title: "The Extrovert", description: "The number three is associated with creativity and sociability. You have a very expressive personality. You may possess talent to pursue one of the arts and become successful. You are romantic at heart. You love to mix with people and hate being alone. You like spreading smiles around with your enthusiasm and humor. You are very popular socially." },
    4: { title: "The Responsible", description: "The number four is associated with sincerity and stability. You are a down-to-earth person. Your home and family are central to your life. You are a dependable person. You perform all your tasks in perfect order and planning. You have loads of common sense and that's great. You are a cool friend who is totally trustworthy." },
    5: { title: "The Explorer", description: "The number five is associated with curiosity and enthusiasm. You love to discover new things and new places. Your questions never stop. You love taking risks and hence your unpredictable nature leads you into problems at times. You are a progressive individual. You love your freedom. You have a very versatile and attractive personality." },
    6: { title: "The Idealist", description: "The number six is associated with companionship and joy. You love the idea of a perfect life with your family and friends. You are a very romantic person and believe in true love. You have a kind and caring heart. You are devoted to your near and dear ones. People close to you know that they can turn to you for help in times of trouble." },
    7: { title: "The Thinker", description: "The number seven is associated with knowledge and imagination. You are a logical person. You are likely to be very knowledgeable about the world around you. You love questioning about things you don't understand. You have a few but close friends. You are considered to be an intellectual person. You prefer peace and quiet in your surroundings." },
    8: { title: "The Achiever", description: "The number eight is associated with success and wealth. You are goal-oriented and strive to go ahead in life. You prefer to be your own boss and do not like working under others. You follow your own judgement and rules. You want to be recognized because of your success and prosperity. You are most likely to succeed in business." },
    9: { title: "The Influential", description: "The number nine is associated with luck and accomplishment. You are a charming person who can make friends very easily. You like to be in control of any situation you are in. In a group of friends, you are likely to be the most entertaining person. You are a compassionate person who goes out of your way to help others. You are sensitive, but few know it." }
};


const descriptions = {
    1: {
        title: "Inspiring and Independent",
        description: "People with the Destiny Number 1 are destined to leadership and independence. They are natural pioneers and are often seen as trendsetters. Their strong will and determination drive them to achieve their goals."
    },
    2: {
        title: "Spiritual and Peaceful",
        description: "People with the Destiny Number 2 are destined to be diplomats and peacemakers. They possess a natural ability to bring people together and create harmony in their surroundings, often guiding others towards a path of understanding and cooperation."
    },
    3: {
        title: "Creative and Motivating",
        description: "People with the Destiny Number 3 are destined to walk the path of creativity and self-expression. Their vibrant personalities and artistic talents inspire those around them, making them a source of motivation and joy."
    },
    4: {
        title: "Practical and Responsible",
        description: "People with the Destiny Number 4 strive to leave behind a positive contribution to society. They are practical, grounded, and dependable, often focusing on building a secure and stable environment for themselves and others."
    },
    5: {
        title: "Versatile and Progressive",
        description: "People with the Destiny Number 5 symbolize freedom and independence. They thrive on adventure and change, often seeking new experiences that allow them to grow and expand their horizons."
    },
    6: {
        title: "Loving and Helpful",
        description: "People with the Destiny Number 6 are destined to be humanitarians and nurturers. Their caring nature drives them to help others, often prioritizing the needs of their loved ones and community."
    },
    7: {
        title: "Intellectual and Mature",
        description: "People with the Destiny Number 7 are masters of their fields, often possessing a deep understanding of life and its complexities. They value knowledge and introspection, making them wise advisors and thinkers."
    },
    8: {
        title: "Ambitious and Energetic",
        description: "People with the Destiny Number 8 have a competitive temperament and are driven by their ambitions. They are often successful in business and leadership roles, using their energy and determination to achieve their goals."
    },
    9: {
        title: "Compassionate and Humanitarian",
        description: "People with the Destiny Number 9 serve humanity with their selfless nature. They are often involved in charitable work and are dedicated to making the world a better place through their compassion and understanding."
    }
};

const soulDescriptions = {
    1: {
        title: "Creative and Independent",
        description: "Individuals with a Soul Number 1 are creative and independent. They have a strong urge to win, believing that defeat does not exist in their dictionary. They strive to be the best, not just for personal satisfaction but to gain unconditional acceptance from others. They possess a firm belief in their capabilities and cannot afford to let themselves down under any circumstance."
    },
    2: {
        title: "Diplomatic and Sensitive",
        description: "People with a Soul Number 2 crave love from everyone, especially from their partner. They enjoy being pampered by their loved ones, which makes them feel special. Meditation eases their stress, and they seek peace and harmony in all aspects of life for personal gratification."
    },
    3: {
        title: "Expressive and Amiable",
        description: "Individuals with a Soul Number 3 have a deep passion for creativity. For them, creativity is not just a recreation but also a medium of expression. They crave recognition for their creative abilities and enjoy being around people, thriving in any work that requires an audience."
    },
    4: {
        title: "Analytical and Reliable",
        description: "Soul Number 4 individuals seek overall security in their lives. They prefer organization and planning, avoiding risky ventures. They despise being indebted and do not accept obligations or favors. They appreciate being regarded with respect and feel contented when acknowledged for their professional knowledge."
    },
    5: {
        title: "Independent and Impulsive",
        description: "People with a Soul Number 5 desire independence and thrive on change. They detest monotony and love to travel, seeking new experiences. Constraints irritate these freedom-loving individuals, and they will go to great lengths to maintain their liberty."
    },
    6: {
        title: "Idealistic and Joyful",
        description: "Individuals with a Soul Number 6 love to serve others but seek constant love and appreciation for their actions. They may ignore those not of the same mindset, but they strive to assist those in need. Their efforts to make others happy bring them immense pleasure."
    },
    7: {
        title: "Spiritual and Patient",
        description: "People with a Soul Number 7 have a deep craving for knowledge. They value solitude and seek to immerse themselves in subjects of interest, often exploring mysticism, spirituality, and the occult. This reflects the belief that number 7 connects heaven and earth."
    },
    8: {
        title: "Courageous and Ambitious",
        description: "Individuals with a Soul Number 8 are extremely materialistic and hardworking. Their primary focus is to lead a comfortable life, striving for success in all endeavors. They seek a life of luxury, power, and social standing."
    },
    9: {
        title: "Benevolent and Foresighted",
        description: "People with a Soul Number 9 desire their lives to benefit others. They possess a strong belief in God and trust their intuition as a connection to the divine. They feel fulfilled when their actions positively impact others."
    },
    11: {
        title: "Intuitive and Motivated",
        description: "Individuals with a Soul Number 11 are highly intuitive, drawing strength from their spiritual nature. They are motivated in all endeavors and possess strong foresight, helping them navigate life. Their helpfulness endears them to others."
    },
    22: {
        title: "Spiritual and Disciplined",
        description: "People with a Soul Number 22 are spiritual in their actions and highly organized in their work. They possess strong leadership skills that drive success. Their psychic sense aids them in making sound decisions."
    }
};

const talentDescriptions = {
    11: "Your best talent is your ability to sense things beyond the surface. You possess a great deal of intuition and you have a spiritual side that is unmatched. You feel a deep connection to the world around you. You may be misunderstood, but you feel at peace with yourself. You want to live life on your own terms, which inspires others to follow your example.",
    22: "The number twenty-two is a higher octave of number four. You are very spiritual in everything that you do. At the same time, you are highly organized and disciplined in your work. You have leadership skills that will bring success to you. You have a strong psychic sense which helps you in making correct decisions.",
    1: "You are fearless and ambitious and love to take the path less traveled. You want to be a pioneer and are a natural born leader. You do best when you are left to your own devices, to create, plan, and invent. You are a great motivator, spurring others to action. You have a great combination of talents, including creativity, ambition, strength, and willpower.",
    2: "You have great empathic abilities and relate well to others. You always seem to know what they mean and can help them get in touch with their own feelings. You are also very creative and enjoy art forms where you can work with others, such as dancing and theater. You have a knack for seeing both sides of any situation, which makes you a peacemaker.",
    3: "You are fun and joyous and people love to be around you. People find you to be colorful and spontaneous and look to you to make a boring day exciting. You are charismatic and people want to refresh in your light, even when you are having a bad day. You have a natural affinity for the arts. People find you reliable and a loyal friend.",
    4: "You are organized and solid. People see you as the rock on which they can lean. You have the skill to make order out of chaos and your biggest skills are the most practical. You are wise and calm and a gentle soul. You are a great stabilizer, and your greatest goal in life is to make a happy environment for those around you.",
    5: "You are full of energy and vitality. You love to be on the move and know how to energize everyone around you. You love a challenge and you thrive when you are the center of attention. People are motivated to get things done when you are around. You are grounded by your five senses and trust what you can see, hear, and feel. You are full of curiosity.",
    6: "Your greatest asset is the compassion you feel for those around you. You love to nurture souls of the needy, whether that be human or animal. You are gentle and kind and have the ability to make others around you feel secure and comforted. People turn to you for advice on almost any situation. You are the truest friend around.",
    7: "People find you mysterious and interesting. You march to the beat of your own drum and can see things that other people cannot. You may find yourself facing unpopularity because you see things differently and you aren’t afraid to see the underside of any issue. You also are great at speaking your mind. You think philosophically and creatively and are great at finding unique solutions to problems.",
    8: "Your best talents are those of planning and leading. You have great decision-making skills and can inspire others with your unique views of situations. People naturally want to follow you. You are a positive thinker who expects success in everything you do. And because of your mindset, you usually are right. Your judgment is sound and you are naturally powerful and successful.",
    9: "Your greatest talent is your compassion. You are idealistic and spiritual and feel a great connection with the universe. Your favorite activity is to help others. You feel that your purpose in life is to be of service to the world around you. You have a love of beauty and art and are very creative. You are idealistic, generous, and passionate about what you believe in."
  };

module.exports = { birthDescriptions, descriptions,soulDescriptions,talentDescriptions };