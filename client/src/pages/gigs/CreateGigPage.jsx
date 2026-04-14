import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiArrowRight, FiArrowLeft, FiCheck, FiX, FiPlus,
  FiImage, FiTrash2, FiStar, FiClock, FiRefreshCw,
  FiDollarSign, FiTag, FiFileText, FiEye
} from 'react-icons/fi';
import gigService from '../../services/gigService';
import categoryService from '../../services/categoryService';

const STEPS = [
  { number: 1, title: 'Overview', icon: <FiTag /> },
  { number: 2, title: 'Pricing', icon: <FiDollarSign /> },
  { number: 3, title: 'Details', icon: <FiFileText /> },
  { number: 4, title: 'Gallery', icon: <FiImage /> },
  { number: 5, title: 'Publish', icon: <FiEye /> },
];

const CreateGigPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // ===== FORM DATA =====
  const [formData, setFormData] = useState({
    // Step 1: Overview
    title: '',
    category: '',
    subcategory: '',
    tags: [],
    tagInput: '',

    // Step 2: Pricing
    packages: {
      basic: {
        description: '',
        price: '',
        deliveryDays: '',
        revisions: 1,
        features: [''],
      },
      standard: {
        description: '',
        price: '',
        deliveryDays: '',
        revisions: 3,
        features: [''],
        isActive: false,
      },
      premium: {
        description: '',
        price: '',
        deliveryDays: '',
        revisions: -1,
        features: [''],
        isActive: false,
      },
    },

    // Step 3: Details
    description: '',
    faqs: [{ question: '', answer: '' }],
    requirements: [{ question: '', required: true }],

    // Step 4: Images handled by imageFiles state

    // Step 5: Status
    status: 'active',
  });

  // Fetch categories on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        setCategories(response.data.categories);
      } catch (error) {
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  // Update subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      const selectedCat = categories.find(c => c._id === formData.category);
      setSubcategories(selectedCat?.subcategories || []);
      setFormData(prev => ({ ...prev, subcategory: '' }));
    } else {
      setSubcategories([]);
    }
  }, [formData.category, categories]);

  // ===== FORM HANDLERS =====
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updatePackage = (pkg, field, value) => {
    setFormData(prev => ({
      ...prev,
      packages: {
        ...prev.packages,
        [pkg]: { ...prev.packages[pkg], [field]: value }
      }
    }));
  };

  const updatePackageFeature = (pkg, index, value) => {
    setFormData(prev => {
      const features = [...prev.packages[pkg].features];
      features[index] = value;
      return {
        ...prev,
        packages: {
          ...prev.packages,
          [pkg]: { ...prev.packages[pkg], features }
        }
      };
    });
  };

  const addPackageFeature = (pkg) => {
    setFormData(prev => ({
      ...prev,
      packages: {
        ...prev.packages,
        [pkg]: {
          ...prev.packages[pkg],
          features: [...prev.packages[pkg].features, '']
        }
      }
    }));
  };

  const removePackageFeature = (pkg, index) => {
    setFormData(prev => ({
      ...prev,
      packages: {
        ...prev.packages,
        [pkg]: {
          ...prev.packages[pkg],
          features: prev.packages[pkg].features.filter((_, i) => i !== index)
        }
      }
    }));
  };

  // Tag handlers
  const addTag = () => {
    const tag = formData.tagInput.trim().toLowerCase();
    if (!tag) return;
    if (formData.tags.length >= 5) {
      toast.error('Maximum 5 tags allowed');
      return;
    }
    if (formData.tags.includes(tag)) {
      toast.error('Tag already added');
      return;
    }
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, tag],
      tagInput: ''
    }));
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
  };

  // FAQ handlers
  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const updateFaq = (index, field, value) => {
    setFormData(prev => {
      const faqs = [...prev.faqs];
      faqs[index][field] = value;
      return { ...prev, faqs };
    });
  };

  const removeFaq = (index) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  // Requirement handlers
  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, { question: '', required: true }]
    }));
  };

  const updateRequirement = (index, field, value) => {
    setFormData(prev => {
      const requirements = [...prev.requirements];
      requirements[index][field] = value;
      return { ...prev, requirements };
    });
  };

  const removeRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  // Image handlers
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = imageFiles.length + files.length;

    if (totalImages > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    // Validate each file
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Each image must be less than 5MB');
        return;
      }
    }

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));

    setImageFiles(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // ===== STEP VALIDATION =====
  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.title || formData.title.length < 10) {
          toast.error('Title must be at least 10 characters');
          return false;
        }
        if (!formData.category) {
          toast.error('Please select a category');
          return false;
        }
        return true;

      case 2:
        if (!formData.packages.basic.description) {
          toast.error('Basic package description is required');
          return false;
        }
        if (!formData.packages.basic.price || formData.packages.basic.price < 5) {
          toast.error('Basic package price must be at least $5');
          return false;
        }
        if (!formData.packages.basic.deliveryDays || formData.packages.basic.deliveryDays < 1) {
          toast.error('Basic package delivery time is required');
          return false;
        }
        return true;

      case 3:
        if (!formData.description || formData.description.length < 50) {
          toast.error('Description must be at least 50 characters');
          return false;
        }
        return true;

      case 4:
        return true;

      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // ===== SUBMIT =====
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Prepare gig data
      const gigData = {
        title: formData.title,
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        tags: formData.tags,
        description: formData.description,
        status: formData.status,
        packages: {
          basic: {
            description: formData.packages.basic.description,
            price: Number(formData.packages.basic.price),
            deliveryDays: Number(formData.packages.basic.deliveryDays),
            revisions: Number(formData.packages.basic.revisions),
            features: formData.packages.basic.features.filter(f => f.trim()),
          },
          standard: {
            ...formData.packages.standard,
            price: Number(formData.packages.standard.price) || undefined,
            deliveryDays: Number(formData.packages.standard.deliveryDays) || undefined,
            features: formData.packages.standard.features.filter(f => f.trim()),
          },
          premium: {
            ...formData.packages.premium,
            price: Number(formData.packages.premium.price) || undefined,
            deliveryDays: Number(formData.packages.premium.deliveryDays) || undefined,
            features: formData.packages.premium.features.filter(f => f.trim()),
          },
        },
        faqs: formData.faqs.filter(f => f.question && f.answer),
        requirements: formData.requirements.filter(r => r.question),
      };

      // Create the gig
      const response = await gigService.createGig(gigData);
      const gigId = response.data.gig._id;

      // Upload images if any
      if (imageFiles.length > 0) {
        await gigService.uploadImages(gigId, imageFiles);
      }

      toast.success('Gig published successfully! 🎉');
      navigate(`/gigs/${gigId}`);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create gig';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[color:var(--bg)] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ===== HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-extrabold text-[color:var(--text-1)]">Create a New Gig</h1>
          <p className="text-[color:var(--text-2)] mt-1">Fill in the details to list your service</p>
        </motion.div>

        {/* ===== PROGRESS BAR ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card rounded-2xl p-6 mb-8 shadow-sm"
        >
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.number} className="flex items-center">
                {/* Step circle */}
                <button
                  onClick={() => {
                    if (step.number < currentStep) setCurrentStep(step.number);
                  }}
                  className={`flex items-center gap-2 transition-all duration-300 ${
                    step.number < currentStep ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                    step.number < currentStep
                      ? 'bg-green-500 text-white'
                      : step.number === currentStep
                      ? 'bg-green-500 text-white ring-4 ring-green-100'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step.number < currentStep ? (
                      <FiCheck className="w-5 h-5" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span className={`hidden sm:block text-sm font-medium transition-colors ${
                    step.number <= currentStep ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </button>

                {/* Connecting line */}
                {index < STEPS.length - 1 && (
                  <div className={`hidden sm:block w-12 lg:w-14 h-0.5 mx-2 transition-colors duration-500 ${
                    step.number < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ===== STEP CONTENT ===== */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="ui-card p-6 sm:p-8"
          >
            {currentStep === 1 && (
              <StepOverview
                formData={formData}
                updateField={updateField}
                categories={categories}
                subcategories={subcategories}
                addTag={addTag}
                removeTag={removeTag}
              />
            )}
            {currentStep === 2 && (
              <StepPricing
                formData={formData}
                updatePackage={updatePackage}
                updatePackageFeature={updatePackageFeature}
                addPackageFeature={addPackageFeature}
                removePackageFeature={removePackageFeature}
              />
            )}
            {currentStep === 3 && (
              <StepDetails
                formData={formData}
                updateField={updateField}
                addFaq={addFaq}
                updateFaq={updateFaq}
                removeFaq={removeFaq}
                addRequirement={addRequirement}
                updateRequirement={updateRequirement}
                removeRequirement={removeRequirement}
              />
            )}
            {currentStep === 4 && (
              <StepGallery
                imagePreviews={imagePreviews}
                handleImageUpload={handleImageUpload}
                removeImage={removeImage}
              />
            )}
            {currentStep === 5 && (
              <StepReview
                formData={formData}
                imagePreviews={imagePreviews}
                categories={categories}
                updateField={updateField}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* ===== NAVIGATION BUTTONS ===== */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 text-gray-600 font-medium rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back
          </button>

          {currentStep < 5 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              Next
              <FiArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  Publish Gig
                  <FiCheck className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// =====================================================
// STEP 1: OVERVIEW (Title, Category, Tags)
// =====================================================
const StepOverview = ({ formData, updateField, categories, subcategories, addTag, removeTag }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Gig Overview</h2>
      <p className="text-gray-500 text-sm">Tell us about the service you're offering</p>
    </div>

    {/* Title */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Gig Title <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => updateField('title', e.target.value)}
        placeholder="I will build a professional React website for your business"
        maxLength={100}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-green-500 transition-colors text-gray-800 placeholder:text-gray-400"
      />
      <div className="flex justify-between mt-1.5">
        <p className="text-xs text-gray-400">Start with "I will..."</p>
        <p className="text-xs text-gray-400">{formData.title.length}/100</p>
      </div>
    </div>

    {/* Category */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.category}
          onChange={(e) => updateField('category', e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-green-500 transition-colors text-gray-800 appearance-none cursor-pointer bg-white"
        >
          <option value="">Select a category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Subcategory</label>
        <select
          value={formData.subcategory}
          onChange={(e) => updateField('subcategory', e.target.value)}
          disabled={!formData.category}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-green-500 transition-colors text-gray-800 appearance-none cursor-pointer bg-white disabled:bg-gray-50 disabled:text-gray-400"
        >
          <option value="">Select subcategory</option>
          {subcategories.map(sub => (
            <option key={sub._id} value={sub._id}>{sub.name}</option>
          ))}
        </select>
      </div>
    </div>

    {/* Tags */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Tags <span className="text-gray-400 font-normal">(max 5)</span>
      </label>
      <div className="flex flex-wrap gap-2 mb-3">
        {formData.tags.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200">
            #{tag}
            <button onClick={() => removeTag(tag)} className="text-green-400 hover:text-red-500 transition-colors">
              <FiX className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={formData.tagInput}
          onChange={(e) => updateField('tagInput', e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
          placeholder="Type a tag and press Enter"
          className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl outline-none focus:border-green-500 transition-colors text-gray-800 text-sm"
        />
        <button
          onClick={addTag}
          type="button"
          className="px-4 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition-colors text-sm"
        >
          Add
        </button>
      </div>
    </div>
  </div>
);

// =====================================================
// STEP 2: PRICING (Packages)
// =====================================================
const StepPricing = ({ formData, updatePackage, updatePackageFeature, addPackageFeature, removePackageFeature }) => {
  const packageConfigs = [
    { key: 'basic', label: 'Basic', required: true, color: 'green' },
    { key: 'standard', label: 'Standard', required: false, color: 'blue' },
    { key: 'premium', label: 'Premium', required: false, color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Pricing Packages</h2>
        <p className="text-gray-500 text-sm">Set up your pricing tiers. Basic is required.</p>
      </div>

      {packageConfigs.map(pkg => (
        <div key={pkg.key} className={`border-2 rounded-2xl p-5 transition-all duration-300 ${
          pkg.key === 'basic' || formData.packages[pkg.key].isActive
            ? 'border-gray-200'
            : 'border-dashed border-gray-200 opacity-60'
        }`}>
          {/* Package Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              {pkg.label}
              {pkg.required && <span className="text-xs text-red-500 font-normal">Required</span>}
            </h3>
            {!pkg.required && (
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm text-gray-500">Enable</span>
                <button
                  type="button"
                  onClick={() => updatePackage(pkg.key, 'isActive', !formData.packages[pkg.key].isActive)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                    formData.packages[pkg.key].isActive ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                    formData.packages[pkg.key].isActive ? 'translate-x-5' : ''
                  }`} />
                </button>
              </label>
            )}
          </div>

          {(pkg.required || formData.packages[pkg.key].isActive) && (
            <div className="space-y-4">
              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                <input
                  type="text"
                  value={formData.packages[pkg.key].description}
                  onChange={(e) => updatePackage(pkg.key, 'description', e.target.value)}
                  placeholder="Describe what's included in this package"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-green-500 transition-colors text-sm"
                />
              </div>

              {/* Price, Delivery, Revisions */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Price ($)</label>
                  <input
                    type="number"
                    min="5"
                    value={formData.packages[pkg.key].price}
                    onChange={(e) => updatePackage(pkg.key, 'price', e.target.value)}
                    placeholder="50"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-green-500 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Delivery (days)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.packages[pkg.key].deliveryDays}
                    onChange={(e) => updatePackage(pkg.key, 'deliveryDays', e.target.value)}
                    placeholder="3"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-green-500 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Revisions</label>
                  <select
                    value={formData.packages[pkg.key].revisions}
                    onChange={(e) => updatePackage(pkg.key, 'revisions', Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-green-500 transition-colors text-sm appearance-none bg-white"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={5}>5</option>
                    <option value={-1}>Unlimited</option>
                  </select>
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Features included</label>
                <div className="space-y-2">
                  {formData.packages[pkg.key].features.map((feature, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updatePackageFeature(pkg.key, idx, e.target.value)}
                        placeholder="e.g., Source code included"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-green-500 transition-colors text-sm"
                      />
                      {formData.packages[pkg.key].features.length > 1 && (
                        <button
                          onClick={() => removePackageFeature(pkg.key, idx)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addPackageFeature(pkg.key)}
                  className="mt-2 flex items-center gap-1.5 text-sm text-green-600 font-medium hover:text-green-700 transition-colors"
                >
                  <FiPlus className="w-4 h-4" /> Add feature
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// =====================================================
// STEP 3: DETAILS (Description, FAQs, Requirements)
// =====================================================
const StepDetails = ({ formData, updateField, addFaq, updateFaq, removeFaq, addRequirement, updateRequirement, removeRequirement }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Gig Details</h2>
      <p className="text-gray-500 text-sm">Describe your service in detail</p>
    </div>

    {/* Description */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Description <span className="text-red-500">*</span>
      </label>
      <textarea
        value={formData.description}
        onChange={(e) => updateField('description', e.target.value)}
        placeholder="Describe your service in detail. What makes you unique? What do clients get?"
        rows={8}
        maxLength={5000}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-green-500 transition-colors text-gray-800 resize-none text-sm leading-relaxed"
      />
      <p className="text-xs text-gray-400 mt-1 text-right">{formData.description.length}/5000</p>
    </div>

    {/* FAQs */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">Frequently Asked Questions</label>
      <div className="space-y-3">
        {formData.faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-gray-400">FAQ #{index + 1}</span>
              {formData.faqs.length > 1 && (
                <button onClick={() => removeFaq(index)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <input
              type="text"
              value={faq.question}
              onChange={(e) => updateFaq(index, 'question', e.target.value)}
              placeholder="Question"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-green-500 transition-colors text-sm"
            />
            <textarea
              value={faq.answer}
              onChange={(e) => updateFaq(index, 'answer', e.target.value)}
              placeholder="Answer"
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-green-500 transition-colors text-sm resize-none"
            />
          </div>
        ))}
      </div>
      <button onClick={addFaq} className="mt-3 flex items-center gap-1.5 text-sm text-green-600 font-medium hover:text-green-700 transition-colors">
        <FiPlus className="w-4 h-4" /> Add FAQ
      </button>
    </div>

    {/* Requirements */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">Requirements from Buyer</label>
      <p className="text-xs text-gray-400 mb-3">What do you need from the buyer to get started?</p>
      <div className="space-y-2">
        {formData.requirements.map((req, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={req.question}
              onChange={(e) => updateRequirement(index, 'question', e.target.value)}
              placeholder="e.g., What is the purpose of your website?"
              className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-green-500 transition-colors text-sm"
            />
            {formData.requirements.length > 1 && (
              <button onClick={() => removeRequirement(index)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <FiTrash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      <button onClick={addRequirement} className="mt-3 flex items-center gap-1.5 text-sm text-green-600 font-medium hover:text-green-700 transition-colors">
        <FiPlus className="w-4 h-4" /> Add Requirement
      </button>
    </div>
  </div>
);

// =====================================================
// STEP 4: GALLERY (Image Upload)
// =====================================================
const StepGallery = ({ imagePreviews, handleImageUpload, removeImage }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Gig Gallery</h2>
      <p className="text-gray-500 text-sm">Upload images that showcase your work (max 5)</p>
    </div>

    {/* Upload Area */}
    <label className="block border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50/30 transition-all duration-300 group">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
        <FiImage className="w-7 h-7 text-gray-400 group-hover:text-green-500 transition-colors" />
      </div>
      <p className="text-gray-700 font-medium mb-1">Click to upload images</p>
      <p className="text-gray-400 text-sm">PNG, JPG, WebP up to 5MB each</p>
      <p className="text-gray-400 text-xs mt-1">{imagePreviews.length}/5 uploaded</p>
    </label>

    {/* Image Previews */}
    {imagePreviews.length > 0 && (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {imagePreviews.map((preview, index) => (
          <div key={index} className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-gray-200">
            <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button
                onClick={() => removeImage(index)}
                className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
            {/* Badge */}
            {index === 0 && (
              <span className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-[10px] font-bold rounded-md">
                Cover
              </span>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

// =====================================================
// STEP 5: REVIEW & PUBLISH
// =====================================================
const StepReview = ({ formData, imagePreviews, categories, updateField }) => {
  const category = categories.find(c => c._id === formData.category);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Review & Publish</h2>
        <p className="text-gray-500 text-sm">Review your gig before publishing</p>
      </div>

      {/* Summary Card */}
      <div className="space-y-5">
        {/* Title & Category */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Title</p>
          <p className="text-gray-900 font-semibold">{formData.title || 'Not set'}</p>
          <p className="text-sm text-gray-500 mt-1">
            Category: {category?.name || 'Not selected'}
          </p>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {formData.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-md">#{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Pricing Summary */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Packages</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['basic', 'standard', 'premium'].map(pkg => {
              const data = formData.packages[pkg];
              if (pkg !== 'basic' && !data.isActive) return null;
              return (
                <div key={pkg} className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="font-bold text-gray-900 capitalize text-sm">{pkg}</p>
                  <p className="text-xl font-extrabold text-green-600 mt-1">${data.price || 0}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><FiClock className="w-3 h-3" /> {data.deliveryDays || 0}d</span>
                    <span className="flex items-center gap-1"><FiRefreshCw className="w-3 h-3" /> {data.revisions === -1 ? '∞' : data.revisions}rev</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Description Preview */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Description</p>
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
            {formData.description || 'Not set'}
          </p>
        </div>

        {/* Images */}
        {imagePreviews.length > 0 && (
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Gallery ({imagePreviews.length} images)</p>
            <div className="flex gap-2 overflow-x-auto">
              {imagePreviews.map((preview, idx) => (
                <img key={idx} src={preview} alt="" className="w-20 h-16 rounded-lg object-cover flex-shrink-0 border border-gray-200" />
              ))}
            </div>
          </div>
        )}

        {/* Publish Options */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Publish as</p>
          <div className="flex gap-3">
            {[
              { value: 'active', label: 'Active', desc: 'Visible to everyone' },
              { value: 'draft', label: 'Draft', desc: 'Save for later' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => updateField('status', option.value)}
                className={`flex-1 p-3 rounded-xl border-2 text-left transition-all duration-300 ${
                  formData.status === option.value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-bold text-gray-900 text-sm">{option.label}</p>
                <p className="text-xs text-gray-500">{option.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGigPage;