import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "curie:ft-meldminds-2023-03-04-03-58-42",//change the model name to be the one you trained in your account in OpenAI
      prompt: generatePromptForOrgHealth(animal),
      stop:"\n",
      temperature: 0.6,
      max_tokens:256

    });

    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}

function generatePromptForOrgHealth(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Recommend me a resource from the company skilled in Azure.
  Team:Tina Sharma is skilled in Azure and Power Platform.
  Recommend me a resource from the company skilled in Scrum.
  Team: Donna Gates is skilled in Scrum and Project Management.
  Recommend me a resource from the company skilled in Legal Filing.
  Team:   Steve Brown is skilled in Legal Filing.
  Recommend me a resource from the company.
  Team:  Recommend me a Agile resource from the company.
  Team:   Donna Gates is skilled in Agile.
  Recommend me a development team from the company. 
  Team:  Tina Sharma and Steve Brown make a good team. 
  Recommend me a project team from the company. 
  Team: Tina Sharma and Steve Brown make a good team. Steve Brown is skilled in Project Management.
  Recommend me a project team with Azure skills from the company. 
  Team:Tina Sharma and Steve Brown make a good team. Steve Brown is skilled in Project Management.
  Recommend me a project team for legal project from the company. 
  Team:Tina Sharma and Steve Brown make a good team. Steve Brown is skilled in Legal Filing.
  Recommend me a resource from the company skilled in Power Platform.
  Team:Tina Sharma and Steve Brown make a good team. Steve Brown is skilled in Power Platform.
  Recommend me a SharePoint resource from the company.
  Team:Tina Sharma is skilled in SharePoint.
  ${capitalizedAnimal}
  Team:`;
}
