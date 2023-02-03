import loadStytch from "./loadStytch";
import {Member, SearchOperator} from "./StytchB2BClient/base";
import {Organization} from "./StytchB2BClient/organizations";
import {Members} from "./StytchB2BClient/members";

const stytch = loadStytch();

export const OrgService = {

  async findBySlug(slug: string): Promise<Organization | null> {
    const orgSearchPromise = stytch.organizations.search({
      query: {
        operator: SearchOperator.AND,
        operands: [
          {filter_name: 'organization_slug', filter_value: slug}
        ]
      }
    })

    try {
      const orgResult = await orgSearchPromise;
      if (orgResult.organizations.length == 0) {
        console.error('Organization not found for slug', slug)
        return null
      }
      const org = orgResult.organizations[0]
      console.log('Organization found for slug', slug)
      return org
    } catch (e) {
      console.error('Failed to search for org by slug', e)
      return null
    }
  },

  async findAllMembers(organization_id: string): Promise<Member[]> {
    return stytch.organizations.members.search({organization_id})
      .then(res => res.members)
  }
}