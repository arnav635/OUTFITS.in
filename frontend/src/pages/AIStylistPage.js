import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';
import useStore from '../store/useStore';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useNavigate } from 'react-router-dom';

const AIStylistPage = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [preferences, setPreferences] = useState({
    gender: 'men',
    occasion: 'casual',
    color: 'any',
    fit: 'regular',
  });

  const handleGetRecommendation = async () => {
    if (!user) {
      toast.error('Please login to use AI Stylist');
      navigate('/auth');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/ai/style-recommendation', { preferences });
      setRecommendation(response.data.recommendation);
      toast.success('Recommendation generated!');
    } catch (error) {
      console.error('Error getting recommendation:', error);
      toast.error('Failed to get recommendation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="ai-stylist-page" className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <Sparkles className="w-16 h-16 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-tight mb-4">
            AI Fashion Stylist
          </h1>
          <p className="text-lg text-muted-foreground">
            Get personalized outfit recommendations powered by AI
          </p>
        </div>

        <div className="border border-border p-8 mb-8">
          <h2 className="text-2xl font-serif font-medium mb-6">Your Preferences</h2>
          <div className="space-y-6">
            <div>
              <Label>Gender</Label>
              <Select
                value={preferences.gender}
                onValueChange={(value) => setPreferences({ ...preferences, gender: value })}
              >
                <SelectTrigger data-testid="ai-gender-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="any">Any</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Occasion</Label>
              <Select
                value={preferences.occasion}
                onValueChange={(value) => setPreferences({ ...preferences, occasion: value })}
              >
                <SelectTrigger data-testid="ai-occasion-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="party">Party</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="workout">Workout</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Color Preference</Label>
              <Select
                value={preferences.color}
                onValueChange={(value) => setPreferences({ ...preferences, color: value })}
              >
                <SelectTrigger data-testid="ai-color-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="black">Black</SelectItem>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="navy">Navy</SelectItem>
                  <SelectItem value="grey">Grey</SelectItem>
                  <SelectItem value="earth-tones">Earth Tones</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Fit Preference</Label>
              <Select
                value={preferences.fit}
                onValueChange={(value) => setPreferences({ ...preferences, fit: value })}
              >
                <SelectTrigger data-testid="ai-fit-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slim">Slim</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="oversized">Oversized</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              data-testid="get-recommendation-button"
              onClick={handleGetRecommendation}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Recommendations
                </>
              )}
            </Button>
          </div>
        </div>

        {recommendation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-border p-8 bg-muted"
          >
            <h2 className="text-2xl font-serif font-medium mb-6">Your Personalized Recommendations</h2>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-base leading-relaxed">{recommendation}</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AIStylistPage;