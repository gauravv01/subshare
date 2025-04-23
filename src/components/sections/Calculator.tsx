import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  servicePrices, 
  ServiceType, 
  PlanType, 
  MembersType, 
  DurationType 
} from "@/lib/calculatorData";

export default function Calculator() {
  const [service, setService] = useState<ServiceType>("netflix");
  const [plan, setPlan] = useState<PlanType>("standard");
  const [members, setMembers] = useState<MembersType>(4);
  const [duration, setDuration] = useState<DurationType>(12);

  const [regularPrice, setRegularPrice] = useState(0);
  const [sharedPrice, setSharedPrice] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [savingsPercentage, setSavingsPercentage] = useState(0);

  useEffect(() => {
    const price = servicePrices[service][plan];
    const shared = Math.ceil(price / members);
    const savings = price - shared;
    const total = savings * duration;
    const percentage = Math.round((savings / price) * 100);

    setRegularPrice(price);
    setSharedPrice(shared);
    setMonthlySavings(savings);
    setTotalSavings(total);
    setSavingsPercentage(percentage);
  }, [service, plan, members, duration]);

  return (
    <section id="pricing" className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-800">How Much Can You Save?</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate how much you can save through subscription sharing.
          </p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid md:grid-cols-2">
            <div className="p-8 bg-gradient-to-br from-primary to-indigo-700 text-white">
              <h3 className="text-2xl font-bold mb-6">Savings Calculator</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Service</label>
                  <select 
                    value={service}
                    onChange={(e) => setService(e.target.value as ServiceType)}
                    className="w-full py-2 px-3 rounded-md bg-white bg-opacity-20 border-0 text-white placeholder-white placeholder-opacity-60 focus:ring-2 focus:ring-white"
                  >
                    <option value="netflix">Netflix</option>
                    <option value="spotify">Spotify Premium</option>
                    <option value="chatgpt">ChatGPT Plus</option>
                    <option value="disney">Disney+</option>
                    <option value="office">Microsoft 365</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subscription Type</label>
                  <select 
                    value={plan}
                    onChange={(e) => setPlan(e.target.value as PlanType)}
                    className="w-full py-2 px-3 rounded-md bg-white bg-opacity-20 border-0 text-white placeholder-white placeholder-opacity-60 focus:ring-2 focus:ring-white"
                  >
                    <option value="basic">Basic</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Number of Members</label>
                  <select 
                    value={members}
                    onChange={(e) => setMembers(parseInt(e.target.value) as MembersType)}
                    className="w-full py-2 px-3 rounded-md bg-white bg-opacity-20 border-0 text-white placeholder-white placeholder-opacity-60 focus:ring-2 focus:ring-white"
                  >
                    <option value="2">2 members</option>
                    <option value="3">3 members</option>
                    <option value="4">4 members</option>
                    <option value="5">5 members</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subscription Period</label>
                  <select 
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) as DurationType)}
                    className="w-full py-2 px-3 rounded-md bg-white bg-opacity-20 border-0 text-white placeholder-white placeholder-opacity-60 focus:ring-2 focus:ring-white"
                  >
                    <option value="1">1 month</option>
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-8 flex flex-col justify-center">
              <div className="text-center">
                <h4 className="text-lg text-gray-600 mb-4">Your Estimated Savings</h4>
                <motion.div 
                  key={totalSavings}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-4xl font-bold text-primary mb-6"
                >
                  ${totalSavings.toLocaleString()}
                </motion.div>

                <div className="grid grid-cols-2 gap-4 mb-8 text-left">
                  <div>
                    <span className="block text-sm text-gray-500">Regular Price</span>
                    <span className="text-gray-800 font-medium">${regularPrice.toLocaleString()}/month</span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Shared Price</span>
                    <span className="text-gray-800 font-medium">${sharedPrice.toLocaleString()}/month</span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Monthly Savings</span>
                    <span className="text-gray-800 font-medium">${monthlySavings.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Annual Savings Rate</span>
                    <span className="text-green-600 font-medium">{savingsPercentage}%</span>
                  </div>
                </div>

                <a href="#" className="block w-full bg-primary hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md transition duration-300">
                  Start Now
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}