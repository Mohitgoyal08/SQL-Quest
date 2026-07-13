import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';
import toast from 'react-hot-toast';

export default function CMSChallenges() {
  const [islands, setIslands] = useState([]);
  const [selectedIsland, setSelectedIsland] = useState('');
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);

  // Form states
  const [formData, setFormData] = useState({});
  const [rewardData, setRewardData] = useState({});
  const [dialogueData, setDialogueData] = useState([]);

  useEffect(() => {
    fetchIslands();
  }, []);

  useEffect(() => {
    if (selectedIsland) {
      fetchChallenges(selectedIsland);
    } else {
      setChallenges([]);
    }
  }, [selectedIsland]);

  const fetchIslands = async () => {
    try {
      const res = await apiClient.get('/admin/islands');
      setIslands(res.data);
    } catch (e) {
      toast.error('Failed to load islands');
    }
  };

  const fetchChallenges = async (islandId) => {
    setLoading(true);
    try {
      // Get all challenges
      const res = await apiClient.get('/admin/challenges');
      // Filter by island (Wait, the backend API should probably filter, but we'll do it client side for now)
      setChallenges(res.data.filter(c => c.island_id === islandId).sort((a,b) => a.order_index - b.order_index));
    } catch (e) {
      toast.error('Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (challenge) => {
    setEditingChallenge(challenge.id);
    setFormData({ ...challenge });
    
    try {
      // Fetch associated rewards and dialogues
      const [rewRes, diagRes] = await Promise.all([
        apiClient.get(`/admin/rewards/${challenge.id}`),
        apiClient.get(`/admin/dialogues/${challenge.id}`)
      ]);
      setRewardData(rewRes.data.length > 0 ? rewRes.data[0] : { xp: 0, coins: 0, diamonds: 0 });
      setDialogueData(diagRes.data);
    } catch (e) {
      toast.error('Failed to load challenge details');
    }
  };

  const handleCreate = () => {
    if (!selectedIsland) return toast.error("Select an island first");
    setEditingChallenge('NEW');
    setFormData({
      id: `new_chal_${Date.now()}`,
      island_id: selectedIsland,
      title: 'New Challenge',
      description: '',
      difficulty: 'Beginner',
      sql_concept: '',
      expected_sql: 'SELECT * FROM ;',
      validation_type: 'EXACT_MATCH',
      is_active: true,
      order_index: challenges.length,
      hint: '',
      hint_2: '',
      npc: 'merchant_marlowe',
      boss_flag: false
    });
    setRewardData({ xp: 100, coins: 50, diamonds: 0 });
    setDialogueData([{
      npc_id: 'merchant_marlowe',
      dialogue_text: ['Welcome to the new challenge!']
    }]);
  };

  const handleSave = async () => {
    try {
      if (editingChallenge === 'NEW') {
        await apiClient.post('/admin/challenges', formData);
      } else {
        await apiClient.put(`/admin/challenges/${editingChallenge}`, formData);
      }

      // Handle Reward
      if (rewardData.id) {
        await apiClient.put(`/admin/rewards/${rewardData.id}`, rewardData);
      } else {
        await apiClient.post('/admin/rewards', { ...rewardData, challenge_id: formData.id });
      }

      // Handle Dialogues (For simplicity, if creating new, we POST. If editing, we just edit the first one or delete/recreate)
      for (const diag of dialogueData) {
        if (diag.id) {
          await apiClient.put(`/admin/dialogues/${diag.id}`, diag);
        } else {
          await apiClient.post('/admin/dialogues', { ...diag, challenge_id: formData.id });
        }
      }

      toast.success('Challenge saved successfully');
      setEditingChallenge(null);
      fetchChallenges(selectedIsland);
    } catch (e) {
      toast.error('Failed to save challenge');
      console.error(e.response?.data || e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await apiClient.delete(`/admin/challenges/${id}`);
      toast.success("Deleted challenge");
      fetchChallenges(selectedIsland);
    } catch (e) {
      toast.error("Failed to delete challenge");
    }
  };

  if (editingChallenge) {
    return (
      <div className="bg-white p-6 rounded shadow max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">{editingChallenge === 'NEW' ? 'Create Challenge' : 'Edit Challenge'}</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">ID</label>
            <input type="text" className="mt-1 w-full border rounded p-2" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} disabled={editingChallenge !== 'NEW'} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" className="mt-1 w-full border rounded p-2" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Story/Description</label>
            <textarea className="mt-1 w-full border rounded p-2" rows="3" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="col-span-2 font-mono">
            <label className="block text-sm font-medium text-gray-700">Expected SQL</label>
            <textarea className="mt-1 w-full border rounded p-2 bg-gray-50" rows="3" value={formData.expected_sql || ''} onChange={e => setFormData({...formData, expected_sql: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Order Index</label>
            <input type="number" className="mt-1 w-full border rounded p-2" value={formData.order_index} onChange={e => setFormData({...formData, order_index: parseInt(e.target.value)})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">NPC ID</label>
            <input type="text" className="mt-1 w-full border rounded p-2" value={formData.npc || ''} onChange={e => setFormData({...formData, npc: e.target.value})} />
          </div>
          <div className="col-span-2 flex gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} />
              Is Active
            </label>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-4 border-t pt-4">Rewards</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">XP</label>
            <input type="number" className="mt-1 w-full border rounded p-2" value={rewardData.xp || 0} onChange={e => setRewardData({...rewardData, xp: parseInt(e.target.value)})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Coins</label>
            <input type="number" className="mt-1 w-full border rounded p-2" value={rewardData.coins || 0} onChange={e => setRewardData({...rewardData, coins: parseInt(e.target.value)})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Diamonds</label>
            <input type="number" className="mt-1 w-full border rounded p-2" value={rewardData.diamonds || 0} onChange={e => setRewardData({...rewardData, diamonds: parseInt(e.target.value)})} />
          </div>
        </div>

        <h3 className="text-xl font-bold mb-4 border-t pt-4">Dialogue (Intro)</h3>
        {dialogueData.map((diag, idx) => (
          <div key={idx} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Dialogue Lines (JSON Array format)</label>
            <textarea 
              className="mt-1 w-full border rounded p-2 font-mono text-sm" 
              rows="4" 
              value={JSON.stringify(diag.dialogue_text, null, 2)} 
              onChange={e => {
                try {
                  const newText = JSON.parse(e.target.value);
                  const newData = [...dialogueData];
                  newData[idx].dialogue_text = newText;
                  setDialogueData(newData);
                } catch(err) {
                  // Wait for valid JSON
                }
              }} 
            />
          </div>
        ))}

        <div className="flex gap-4 mt-8">
          <button onClick={handleSave} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-bold">Save Challenge</button>
          <button onClick={() => setEditingChallenge(null)} className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 font-bold">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex gap-4 items-center">
        <select 
          className="border rounded p-2 bg-white min-w-[200px]"
          value={selectedIsland}
          onChange={(e) => setSelectedIsland(e.target.value)}
        >
          <option value="">-- Select an Island --</option>
          {islands.map(island => (
            <option key={island.id} value={island.id}>{island.name}</option>
          ))}
        </select>
        
        {selectedIsland && (
          <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold">
            + New Challenge
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading challenges...</p>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b">Order</th>
                <th className="p-3 border-b">ID</th>
                <th className="p-3 border-b">Title</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {challenges.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">No challenges found for this island.</td>
                </tr>
              ) : (
                challenges.map(chal => (
                  <tr key={chal.id} className="hover:bg-gray-50 border-b last:border-0">
                    <td className="p-3">{chal.order_index}</td>
                    <td className="p-3 font-mono text-sm">{chal.id}</td>
                    <td className="p-3 font-semibold">{chal.title}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${chal.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {chal.is_active ? 'ACTIVE' : 'DISABLED'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button onClick={() => handleEdit(chal)} className="text-blue-600 hover:underline mr-4">Edit</button>
                      <button onClick={() => handleDelete(chal.id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
