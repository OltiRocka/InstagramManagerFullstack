import requests
from json import JSONDecodeError 
class Session(requests.Session):
    def __init__(self):
        super(Session, self).__init__()
        self.headers = {
        'Host': 'www.instagram.com',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/116.0',
        'Accept': '/',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'X-IG-WWW-Claim': '0',
        'X-Requested-With': 'XMLHttpRequest',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Referer': 'https://www.instagram.com/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
            "TE":"trailers"
}
        
        self._response = self.get('https://instagram.com/')
        self.headers['X-IG-App-ID'] = self._response.text[self._response.text.find('{"appId":')+9:].split(',')[0]
        self.headers['Cookie'] = '; '.join([x.name + '=' + x.value for x in self.cookies])+';'
    def get_by_username(self,username):
        response =  self.get(f'https://www.instagram.com/api/v1/users/web_profile_info/?username={username}')
        try:
            data = response.json()
        except JSONDecodeError:
            return "JSONERROR"
        data = self._fix_user_data(data)
        return data
    def get_by_hashtag(self,hashtag):
        response = self.get(f'https://www.instagram.com/api/v1/tags/logged_out_web_info/?tag_name={hashtag}')
        try:
            data = response.json()
        except JSONDecodeError:
            return "JSONERROR"
        return data
        
    def _fix_user_data(self,data):
        user_data = data['data']['user']
        test_data = {'id':user_data['id'], 'username':username,'is_private':user_data['is_private'],'bio':user_data['biography'],'followers':user_data['edge_followed_by']['count'],'following':user_data['edge_follow']['count'],
            'profile_image':user_data['profile_pic_url_hd'],'num_content':user_data['edge_owner_to_timeline_media']['count'],'content':[
                {'id': content['node']['id'],
                'type':'video' if content['node']['is_video'] else 'image',
                 'display_url':content['node']['display_url'],
                 'url':content['node']['video_url'] if content['node']['is_video'] else content['node']['display_url'],
                 'description':content['node']['edge_media_to_caption']['edges'][0]['node']['text'],
                 'views':content['node']['video_view_count'] if content['node']['is_video'] else 0,
                 'likes':content['node']['edge_liked_by']['count'],
                 'comments':content['node']['edge_media_to_comment']['count'],
                'carousel':False,
                 'owner':'owner_id'
                } for content in  user_data['edge_owner_to_timeline_media']['edges'] if 'edge_sidecar_to_children' not in content['node'].keys()
            ]}
        test = (
                [
                {'id': content['node']['id'],
                 'description':content['node']['edge_media_to_caption']['edges'][0]['node']['text'],
                 'likes':content['node']['edge_liked_by']['count'],
                 'comments':content['node']['edge_media_to_comment']['count'],
                'carousel':True,
                 'owner':content['node']['owner']['id'],
                'content':content['node']['edge_sidecar_to_children']['edges']
                }  for content in  user_data['edge_owner_to_timeline_media']['edges'] if 'edge_sidecar_to_children' in content['node'].keys()]
    
                )   
        for a in test:
            for b in a['content']:
                test_data['content'].append({'id': a['id'],
                        'type':'video' if b['node']['is_video'] else 'image',
                         'display_url':b['node']['display_url'],
                         'url':b['node']['video_url'] if b['node']['is_video'] else b['node']['display_url'],
                         'description':a['description'],
                         'views':b['node']['video_view_count'] if b['node']['is_video'] else 0,
                         'likes':a['likes'],
                         'comments':a['comments'],
                        'carousel':True,
                         'owner':a['owner']
                        })
        return test_data