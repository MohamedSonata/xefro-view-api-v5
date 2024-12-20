// src/extensions/users-permissions/content-types/user/lifecycles.js

module.exports = {
    // async afterUpdate(event){

    // },
    async afterCreate(event) {
        const { result, params } = event;
        /**
         * Fetches the version release data for the given event result ID, including the associated platforms version releases.
         *
         * @param {Object} event - The event object containing the result.
         * @param {string} event.result.id - The ID of the version release to fetch.
         * @returns {Promise<Object>} - The version release data, including the associated platforms version releases.
         */
        const versionReleaseData = await strapi.documents('api::version-release.version-release'
        ).findOne(
            {
                documentId: event.result.documentId,
                populate: {
                    platformsVersionReleases: true
                }

            }
        );

        /**
         * Fetches the version release data for the given event result ID, including the associated platforms requirements.
         *
         * @param {Object} event - The event object containing the result.
         * @param {string} event.result.id - The ID of the version release to fetch.
         * @returns {Promise<Object>} - The version release data, including the associated platforms requirements.
         */
        var singleTypeReleaseData = await strapi.documents("api::latest-version.latest-version",

        ).findFirst({
            populate: {
                platformsRequirements: true
            }
        });
      
        await updateLatestVersionAfterCreate(singleTypeReleaseData, versionReleaseData);

        const currentDate = new Date();
        const timeNow = currentDate.toISOString();


        function incrementBuildNumber(versionString) {
            const parts = versionString.split('+');

            if (parts.length === 2) {
                const buildNumber = parseInt(parts[1], 10);
                if (!isNaN(buildNumber)) {
                    const newBuildNumber = buildNumber + 1;
                    return `${parts[0]}+${newBuildNumber}`;
                }
            }

            return versionString; // Return original string if invalid format
        }
    
    }
}


async function updateLatestVersionAfterCreate(singleTypeReleaseData, versionReleaseData) {

    if (versionReleaseData != null) {
        if (versionReleaseData.platformsVersionReleases.length > 0) {
            try {
                const platformsRequirementsUpdated = await platformRequirementsUpdated(versionReleaseData, singleTypeReleaseData);

                const release = await strapi.documents("api::latest-version.latest-version",
                ).update({
                    documentId: singleTypeReleaseData.documentId,
                    data: {
                        version: versionReleaseData.version,
                        versionName: versionReleaseData.versionName,
                        brief: versionReleaseData.brief,
                        platformsRequirements: platformsRequirementsUpdated
            
                        // platformsRequirements: platformsRequirements,
                    }
            
                });
              
            } catch (error) {
               strapi.log.error("Error", error.toString())
            }
        }
    }
}

async function platformRequirementsUpdated(versionReleaseData, singleTypeReleaseData) {
    const platformsRequirementsUpdated = Array.from(versionReleaseData.platformsVersionReleases.map((singleTypeRequirement, index) => {
        const hasVersionReleaseData = versionReleaseData.platformsVersionReleases &&
            versionReleaseData.platformsVersionReleases.length > index &&
            versionReleaseData.platformsVersionReleases[index] != null;
        const platformsRequirementsOBJ = new PlatFormsRequirements(
            {
                isMandatory: hasVersionReleaseData
                    ? versionReleaseData.platformsVersionReleases[index].isMandatory ??
                    singleTypeReleaseData.platformsRequirements[index].isMandatory ?? false
                    : singleTypeRequirement.isMandatory,
                platform: hasVersionReleaseData
                    ? versionReleaseData.platformsVersionReleases[index].platform ?? singleTypeReleaseData.platformsRequirements[index].platform ?? "Windows"
                    : singleTypeRequirement.platform,
                minSupportedVersionCode: hasVersionReleaseData
                    ? versionReleaseData.platformsVersionReleases[index].minSupportedVersion ?? singleTypeReleaseData.platformsRequirements[index].minSupportedVersionCode ?? 102
                    : singleTypeRequirement.minSupportedVersion,
                version: hasVersionReleaseData
                    ? versionReleaseData.platformsVersionReleases[index].version ?? singleTypeReleaseData.platformsRequirements[index].version ?? ""
                    : singleTypeRequirement.version,
                versionCode: hasVersionReleaseData
                    ? versionReleaseData.platformsVersionReleases[index].versionCode ?? singleTypeReleaseData.platformsRequirements[index].versionCode ?? 102
                    : singleTypeRequirement.versionCode,
                priority: hasVersionReleaseData
                    ? versionReleaseData.platformsVersionReleases[index].priority ?? singleTypeReleaseData.platformsRequirements[index].priority ?? "none" : singleTypeRequirement.priority,
                downloadURL: hasVersionReleaseData
                    ? versionReleaseData.platformsVersionReleases[index].downloadURL ?? singleTypeReleaseData.platformsRequirements[index].downloadURL ?? "" : singleTypeRequirement.downloadURL

            }

        );

        return platformsRequirementsOBJ.toJson();
    }));
    return platformsRequirementsUpdated;
}


// Create a function to generate numeric IDs

class PlatFormsRequirements {
    isMandatory: boolean;
    platform: string;
    minSupportedVersionCode: number;
    version: string;
    versionCode: number;
    priority: string;
    downloadURL: string;

    constructor({
        isMandatory,
        platform,
        minSupportedVersionCode,
        version,
        versionCode,
        priority,
        downloadURL,
    }: {  // Type the parameters here
        isMandatory: boolean;
        platform: string;
        minSupportedVersionCode: number;
        version: string;
        versionCode: number;
        priority: string;
        downloadURL: string;
    }) {
        this.isMandatory = isMandatory;
        this.platform = platform;
        this.minSupportedVersionCode = minSupportedVersionCode;
        this.version = version;
        this.versionCode = versionCode;
        this.priority = priority;
        this.downloadURL = downloadURL;
    }


    static fromJson(json: any): PlatFormsRequirements { // More type safety
        return new PlatFormsRequirements(
            {
                isMandatory: json.isMandatory,
                platform: json.platform,
                minSupportedVersionCode: json.minSupportedVersionCode,
                version: json.version,
                versionCode: json.versionCode,
                priority: json.priority,
                downloadURL: json.downloadURL,
            }

        );
    }


    toJson(): any {  // More type safety with the return type
        return {
            isMandatory: this.isMandatory,
            platform: this.platform,
            minSupportedVersionCode: this.minSupportedVersionCode,
            version: this.version,
            versionCode: this.versionCode,
            priority: this.priority,
            downloadURL: this.downloadURL,
        };
    }

}