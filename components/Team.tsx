import React from "react";

const team = [
  {
    name: "Sanjana",
    role: "Founder & Lead Developer",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    name: "Bikram",
    role: "ML Engineer",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    name: "Sushmita",
    role: "Full Stack Developer",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    name: "Bishi",
    role: "Backend Developer",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    name: "Brikhesh",
    role: "Frontend Stack Developer",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
];

export default function Team() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800">Our Team</h2>
        <p className="mt-4 text-center text-gray-600">
          The brains behind PhishGuard.
        </p>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, i) => (
            <div
              key={i}
              className="bg-white shadow-lg rounded-2xl p-6 text-center"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto"
              />
              <h3 className="mt-4 text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
