import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllOpportunitiesAdmin(req, res) {
  try {
    const opportunities = await prisma.opportunity.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ count: opportunities.length, opportunities });
  } catch (error) {
    console.error('Error fetching admin opportunities:', error);
    res.status(500).json({ error: 'Failed to fetch admin opportunity list.' });
  }
}

export async function createOpportunityAdmin(req, res) {
  try {
    const {
      title,
      organization,
      category,
      description,
      eligibility,
      requiredSkills,
      preferredSkills,
      deadline,
      location,
      mode,
      experienceRequirements,
      educationRequirements,
      applicationUrl,
      tags,
      source
    } = req.body;

    if (!title || !organization || !category || !description) {
      return res.status(400).json({ error: 'Title, organization, category, and description are required.' });
    }

    const opportunity = await prisma.opportunity.create({
      data: {
        title,
        organization,
        category,
        description,
        eligibilityJson: JSON.stringify(eligibility || { minYear: 1, maxYear: 4, branches: ['all'], academicLevel: 'Undergraduate' }),
        requiredSkillsJson: JSON.stringify(requiredSkills || []),
        preferredSkillsJson: JSON.stringify(preferredSkills || []),
        deadline: deadline ? new Date(deadline) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        location: location || 'Remote',
        mode: mode || 'Remote',
        experienceRequirements: experienceRequirements || 'Open to all students',
        educationRequirements: educationRequirements || 'Enrolled student',
        applicationUrl: applicationUrl || 'https://opportunityos.dev/apply',
        tagsJson: JSON.stringify(tags || [category, 'Web Development']),
        source: source || 'Admin Portal',
        lastUpdated: 'Just now',
        isVerified: true
      }
    });

    res.status(201).json({ message: 'Opportunity created successfully.', opportunity });
  } catch (error) {
    console.error('Error creating opportunity:', error);
    res.status(500).json({ error: 'Failed to create opportunity.' });
  }
}

export async function updateOpportunityAdmin(req, res) {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };

    if (updateData.requiredSkills) {
      updateData.requiredSkillsJson = JSON.stringify(updateData.requiredSkills);
      delete updateData.requiredSkills;
    }
    if (updateData.preferredSkills) {
      updateData.preferredSkillsJson = JSON.stringify(updateData.preferredSkills);
      delete updateData.preferredSkills;
    }
    if (updateData.eligibility) {
      updateData.eligibilityJson = JSON.stringify(updateData.eligibility);
      delete updateData.eligibility;
    }
    if (updateData.tags) {
      updateData.tagsJson = JSON.stringify(updateData.tags);
      delete updateData.tags;
    }

    const opportunity = await prisma.opportunity.update({
      where: { id },
      data: updateData
    });

    res.json({ message: 'Opportunity updated successfully.', opportunity });
  } catch (error) {
    console.error('Error updating opportunity:', error);
    res.status(500).json({ error: 'Failed to update opportunity.' });
  }
}

export async function deleteOpportunityAdmin(req, res) {
  try {
    const { id } = req.params;
    await prisma.opportunity.delete({ where: { id } });
    res.json({ message: 'Opportunity deleted successfully.' });
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    res.status(500).json({ error: 'Failed to delete opportunity.' });
  }
}
